from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import httpx
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Email Configuration (Mock mode by default - set SMTP_* env vars for real emails)
SMTP_HOST = os.environ.get('SMTP_HOST', '')
SMTP_PORT = int(os.environ.get('SMTP_PORT', '587'))
SMTP_USER = os.environ.get('SMTP_USER', '')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')
OFFICINA_EMAIL = os.environ.get('OFFICINA_EMAIL', 'autofficinaeuganea@libero.it')
OFFICINA_PHONE = os.environ.get('OFFICINA_PHONE', '+393203145049')
EMAIL_MOCK_MODE = not all([SMTP_HOST, SMTP_USER, SMTP_PASSWORD])

# Create the main app
app = FastAPI(title="Autofficina Euganea API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ===================== EMAIL SERVICE =====================

async def send_email(to_email: str, subject: str, html_content: str, text_content: str = None):
    """
    Send email - Mock mode logs to console, Real mode sends via SMTP
    To enable real email, set these env vars:
    - SMTP_HOST (e.g., smtp.libero.it)
    - SMTP_PORT (e.g., 587)
    - SMTP_USER (e.g., autofficinaeuganea@libero.it)
    - SMTP_PASSWORD (app password)
    """
    if EMAIL_MOCK_MODE:
        # Mock mode - log email details
        logger.info(f"""
========== EMAIL MOCK (would be sent) ==========
TO: {to_email}
SUBJECT: {subject}
CONTENT:
{text_content or html_content}
================================================
        """)
        # Store in database for review
        await db.email_logs.insert_one({
            "to": to_email,
            "subject": subject,
            "html_content": html_content,
            "text_content": text_content,
            "status": "mock_logged",
            "created_at": datetime.now(timezone.utc)
        })
        return True
    else:
        # Real SMTP mode
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = SMTP_USER
            msg['To'] = to_email
            
            if text_content:
                msg.attach(MIMEText(text_content, 'plain', 'utf-8'))
            msg.attach(MIMEText(html_content, 'html', 'utf-8'))
            
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)
            
            await db.email_logs.insert_one({
                "to": to_email,
                "subject": subject,
                "status": "sent",
                "created_at": datetime.now(timezone.utc)
            })
            logger.info(f"Email sent to {to_email}: {subject}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            await db.email_logs.insert_one({
                "to": to_email,
                "subject": subject,
                "status": "failed",
                "error": str(e),
                "created_at": datetime.now(timezone.utc)
            })
            return False

async def send_booking_confirmation_to_customer(booking: dict, user: dict, vehicle: dict, service: dict):
    """Send booking confirmation email to customer"""
    scheduled = datetime.fromisoformat(str(booking['scheduled_date']).replace('Z', '+00:00'))
    date_str = scheduled.strftime("%d/%m/%Y alle ore %H:%M")
    
    subject = f"✅ Prenotazione Confermata - Autofficina Euganea"
    
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #E53935; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">🔧 AUTOFFICINA EUGANEA</h1>
        </div>
        <div style="padding: 20px; background: #f5f5f5;">
            <h2 style="color: #333;">Ciao {user['name']}!</h2>
            <p>La tua prenotazione è stata <strong style="color: #4CAF50;">confermata</strong>.</p>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #E53935; margin-top: 0;">📋 Dettagli Prenotazione</h3>
                <p><strong>Servizio:</strong> {service['name']}</p>
                <p><strong>Veicolo:</strong> {vehicle['marca']} {vehicle['modello']} ({vehicle['targa']})</p>
                <p><strong>Data:</strong> {date_str}</p>
                <p><strong>Durata stimata:</strong> ~{service['estimated_hours']} ore</p>
                {f"<p><strong>Preventivo:</strong> da €{service['price_estimate']}</p>" if service.get('price_estimate') else ""}
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px;">
                <h3 style="color: #E53935; margin-top: 0;">📍 Dove Trovarci</h3>
                <p><strong>Indirizzo:</strong> Via Galzignanese 14/A, Battaglia Terme (PD)</p>
                <p><strong>Telefono:</strong> {OFFICINA_PHONE}</p>
                <p><strong>WhatsApp:</strong> <a href="https://wa.me/393203145049">Contattaci su WhatsApp</a></p>
            </div>
            
            <p style="margin-top: 20px; color: #666;">
                Puoi monitorare lo stato del tuo veicolo direttamente dall'app!
            </p>
        </div>
        <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p>Autofficina Euganea - La tua officina di fiducia</p>
            <p>{OFFICINA_EMAIL}</p>
        </div>
    </div>
    """
    
    text_content = f"""
AUTOFFICINA EUGANEA - Prenotazione Confermata

Ciao {user['name']}!

La tua prenotazione è stata confermata.

DETTAGLI:
- Servizio: {service['name']}
- Veicolo: {vehicle['marca']} {vehicle['modello']} ({vehicle['targa']})
- Data: {date_str}
- Durata stimata: ~{service['estimated_hours']} ore

DOVE TROVARCI:
- Indirizzo: Via Galzignanese 14/A, Battaglia Terme (PD)
- Telefono: {OFFICINA_PHONE}
- Email: {OFFICINA_EMAIL}

Puoi monitorare lo stato del tuo veicolo direttamente dall'app!

Autofficina Euganea - La tua officina di fiducia
    """
    
    await send_email(user['email'], subject, html_content, text_content)

async def send_booking_notification_to_officina(booking: dict, user: dict, vehicle: dict, service: dict):
    """Send new booking notification to officina"""
    scheduled = datetime.fromisoformat(str(booking['scheduled_date']).replace('Z', '+00:00'))
    date_str = scheduled.strftime("%d/%m/%Y alle ore %H:%M")
    
    subject = f"🆕 Nuova Prenotazione - {user['name']} - {service['name']}"
    
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #E53935; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">🔧 NUOVA PRENOTAZIONE</h1>
        </div>
        <div style="padding: 20px; background: #f5f5f5;">
            <h2 style="color: #333;">Nuova richiesta di prenotazione!</h2>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #E53935; margin-top: 0;">👤 Cliente</h3>
                <p><strong>Nome:</strong> {user['name']}</p>
                <p><strong>Email:</strong> {user['email']}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #E53935; margin-top: 0;">🚗 Veicolo</h3>
                <p><strong>Marca/Modello:</strong> {vehicle['marca']} {vehicle['modello']}</p>
                <p><strong>Targa:</strong> {vehicle['targa']}</p>
                {f"<p><strong>Anno:</strong> {vehicle.get('anno')}</p>" if vehicle.get('anno') else ""}
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #E53935; margin-top: 0;">📋 Intervento</h3>
                <p><strong>Servizio:</strong> {service['name']}</p>
                <p><strong>Data richiesta:</strong> {date_str}</p>
                <p><strong>Durata stimata:</strong> ~{service['estimated_hours']} ore</p>
                {f"<p><strong>Note cliente:</strong> {booking.get('notes')}</p>" if booking.get('notes') else ""}
            </div>
            
            <p style="margin-top: 20px;">
                <a href="https://workshop-connect.preview.emergentagent.com/admin" 
                   style="background: #E53935; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                    Gestisci Prenotazione
                </a>
            </p>
        </div>
    </div>
    """
    
    text_content = f"""
NUOVA PRENOTAZIONE

Cliente: {user['name']} ({user['email']})
Veicolo: {vehicle['marca']} {vehicle['modello']} - {vehicle['targa']}
Servizio: {service['name']}
Data: {date_str}
Note: {booking.get('notes', 'Nessuna')}

Gestisci su: https://workshop-connect.preview.emergentagent.com/admin
    """
    
    await send_email(OFFICINA_EMAIL, subject, html_content, text_content)

async def send_status_update_to_customer(booking: dict, user: dict, vehicle: dict, new_status: str):
    """Send status update email to customer"""
    status_labels = {
        'waiting': 'In attesa di consegna',
        'checked_in': 'Check-in effettuato',
        'in_progress': 'In lavorazione',
        'testing': 'In fase di collaudo',
        'ready': 'Pronto al ritiro! 🎉',
        'delivered': 'Consegnato'
    }
    
    status_label = status_labels.get(new_status, new_status)
    
    subject = f"🚗 Aggiornamento Veicolo: {status_label} - Autofficina Euganea"
    
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #E53935; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">🔧 AUTOFFICINA EUGANEA</h1>
        </div>
        <div style="padding: 20px; background: #f5f5f5;">
            <h2 style="color: #333;">Ciao {user['name']}!</h2>
            <p>Aggiornamento sul tuo veicolo:</p>
            
            <div style="background: {'#4CAF50' if new_status == 'ready' else '#2196F3'}; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h2 style="margin: 0;">{status_label}</h2>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px;">
                <p><strong>Veicolo:</strong> {vehicle['marca']} {vehicle['modello']} ({vehicle['targa']})</p>
            </div>
            
            {"<p style='color: #4CAF50; font-size: 18px; text-align: center;'><strong>Puoi venire a ritirare il tuo veicolo!</strong></p>" if new_status == 'ready' else ""}
            
            <p style="margin-top: 20px; color: #666;">
                Per qualsiasi domanda contattaci su WhatsApp: <a href="https://wa.me/393203145049">{OFFICINA_PHONE}</a>
            </p>
        </div>
        <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p>Autofficina Euganea - {OFFICINA_EMAIL}</p>
        </div>
    </div>
    """
    
    text_content = f"""
AUTOFFICINA EUGANEA - Aggiornamento Veicolo

Ciao {user['name']}!

Stato attuale: {status_label}
Veicolo: {vehicle['marca']} {vehicle['modello']} ({vehicle['targa']})

{"Puoi venire a ritirare il tuo veicolo!" if new_status == 'ready' else ""}

Contattaci: {OFFICINA_PHONE}
Email: {OFFICINA_EMAIL}
    """
    
    await send_email(user['email'], subject, html_content, text_content)

# ===================== MODELS =====================

# Auth Models
class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    phone: Optional[str] = None
    created_at: datetime
    gdpr_accepted: bool = False
    marketing_accepted: bool = False

class UserCreate(BaseModel):
    email: str
    name: str
    picture: Optional[str] = None

class SessionDataResponse(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str] = None
    session_token: str

# Vehicle Models
class Vehicle(BaseModel):
    vehicle_id: str = Field(default_factory=lambda: f"veh_{uuid.uuid4().hex[:12]}")
    user_id: str
    marca: str  # Brand
    modello: str  # Model
    targa: str  # License plate
    anno: Optional[int] = None  # Year
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class VehicleCreate(BaseModel):
    marca: str
    modello: str
    targa: str
    anno: Optional[int] = None

class VehicleUpdate(BaseModel):
    marca: Optional[str] = None
    modello: Optional[str] = None
    targa: Optional[str] = None
    anno: Optional[int] = None

# Service Models
class Service(BaseModel):
    service_id: str = Field(default_factory=lambda: f"srv_{uuid.uuid4().hex[:12]}")
    name: str
    description: str
    estimated_hours: float
    price_estimate: Optional[float] = None
    category: str  # tagliando, gomme, diagnosi, riparazione, tuning
    active: bool = True

class ServiceCreate(BaseModel):
    name: str
    description: str
    estimated_hours: float
    price_estimate: Optional[float] = None
    category: str

# Booking Models
class Booking(BaseModel):
    booking_id: str = Field(default_factory=lambda: f"book_{uuid.uuid4().hex[:12]}")
    user_id: str
    vehicle_id: str
    service_id: str
    scheduled_date: datetime
    status: str = "pending"  # pending, confirmed, rejected, completed, cancelled
    notes: Optional[str] = None
    admin_notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BookingCreate(BaseModel):
    vehicle_id: str
    service_id: str
    scheduled_date: datetime
    notes: Optional[str] = None

class BookingUpdate(BaseModel):
    status: Optional[str] = None
    admin_notes: Optional[str] = None
    scheduled_date: Optional[datetime] = None

# Vehicle Status Tracking Models
class VehicleStatus(BaseModel):
    status_id: str = Field(default_factory=lambda: f"stat_{uuid.uuid4().hex[:12]}")
    booking_id: str
    status: str  # waiting, checked_in, in_progress, testing, ready, delivered
    notes: Optional[str] = None
    updated_by: Optional[str] = None  # admin user who updated
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class VehicleStatusCreate(BaseModel):
    booking_id: str
    status: str
    notes: Optional[str] = None

# Time Slot Models
class TimeSlot(BaseModel):
    date: str
    time: str
    available: bool

# Admin Models
class AdminUser(BaseModel):
    admin_id: str = Field(default_factory=lambda: f"adm_{uuid.uuid4().hex[:12]}")
    email: str
    name: str
    role: str = "staff"  # staff, manager, admin
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ===================== AUTH HELPERS =====================

async def get_session_token(request: Request) -> Optional[str]:
    """Extract session token from cookie or Authorization header"""
    # Try cookie first
    session_token = request.cookies.get("session_token")
    if session_token:
        return session_token
    
    # Try Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header[7:]
    
    return None

async def get_current_user(request: Request) -> User:
    """Get current authenticated user"""
    session_token = await get_session_token(request)
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session = await db.user_sessions.find_one(
        {"session_token": session_token},
        {"_id": 0}
    )
    
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Check expiry with timezone awareness
    expires_at = session["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    user = await db.users.find_one(
        {"user_id": session["user_id"]},
        {"_id": 0}
    )
    
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user)

async def get_optional_user(request: Request) -> Optional[User]:
    """Get current user if authenticated, None otherwise"""
    try:
        return await get_current_user(request)
    except HTTPException:
        return None

# ===================== AUTH ROUTES =====================

@api_router.post("/auth/session")
async def exchange_session(request: Request, response: Response):
    """Exchange session_id for session_token"""
    session_id = request.headers.get("X-Session-ID")
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    # Call Emergent Auth API
    async with httpx.AsyncClient() as client:
        try:
            auth_response = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
            
            if auth_response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session ID")
            
            user_data = auth_response.json()
            
        except httpx.RequestError as e:
            logger.error(f"Auth API error: {e}")
            raise HTTPException(status_code=500, detail="Authentication service error")
    
    # Check if user exists
    existing_user = await db.users.find_one(
        {"email": user_data["email"]},
        {"_id": 0}
    )
    
    if existing_user:
        user_id = existing_user["user_id"]
    else:
        # Create new user
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        new_user = {
            "user_id": user_id,
            "email": user_data["email"],
            "name": user_data["name"],
            "picture": user_data.get("picture"),
            "created_at": datetime.now(timezone.utc),
            "gdpr_accepted": False,
            "marketing_accepted": False
        }
        await db.users.insert_one(new_user)
    
    # Store session
    session_token = user_data["session_token"]
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at,
        "created_at": datetime.now(timezone.utc)
    })
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    # Get full user data
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    
    return {
        "user": user,
        "session_token": session_token
    }

@api_router.get("/auth/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user"""
    session_token = await get_session_token(request)
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.put("/auth/gdpr")
async def update_gdpr(
    request: Request,
    gdpr_accepted: bool,
    marketing_accepted: bool = False,
    current_user: User = Depends(get_current_user)
):
    """Update GDPR consent"""
    await db.users.update_one(
        {"user_id": current_user.user_id},
        {"$set": {
            "gdpr_accepted": gdpr_accepted,
            "marketing_accepted": marketing_accepted
        }}
    )
    return {"message": "Preferences updated"}

# ===================== CONTACT INFO =====================

@api_router.get("/contact-info")
async def get_contact_info():
    """Get officina contact information"""
    return {
        "name": "Autofficina Euganea",
        "email": OFFICINA_EMAIL,
        "phone": OFFICINA_PHONE,
        "whatsapp": f"https://wa.me/393203145049",
        "whatsapp_number": "+39 320 314 5049",
        "address": "Via Galzignanese 14/A, Battaglia Terme (PD)",
        "hours": {
            "weekdays": "Lun-Ven: 8:00 - 19:00",
            "saturday": "Sab: 8:00 - 12:00",
            "sunday": "Dom: Chiuso"
        },
        "social": {
            "instagram": "@autofficina_euganea"
        },
        "email_mode": "mock" if EMAIL_MOCK_MODE else "live"
    }

# ===================== VEHICLE ROUTES =====================

@api_router.get("/vehicles", response_model=List[Vehicle])
async def get_user_vehicles(current_user: User = Depends(get_current_user)):
    """Get all vehicles for current user"""
    vehicles = await db.vehicles.find(
        {"user_id": current_user.user_id},
        {"_id": 0}
    ).to_list(100)
    return [Vehicle(**v) for v in vehicles]

@api_router.post("/vehicles", response_model=Vehicle)
async def create_vehicle(
    vehicle: VehicleCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new vehicle"""
    new_vehicle = Vehicle(
        user_id=current_user.user_id,
        **vehicle.dict()
    )
    await db.vehicles.insert_one(new_vehicle.dict())
    return new_vehicle

@api_router.put("/vehicles/{vehicle_id}", response_model=Vehicle)
async def update_vehicle(
    vehicle_id: str,
    vehicle_update: VehicleUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a vehicle"""
    existing = await db.vehicles.find_one(
        {"vehicle_id": vehicle_id, "user_id": current_user.user_id},
        {"_id": 0}
    )
    if not existing:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    update_data = {k: v for k, v in vehicle_update.dict().items() if v is not None}
    if update_data:
        await db.vehicles.update_one(
            {"vehicle_id": vehicle_id},
            {"$set": update_data}
        )
    
    updated = await db.vehicles.find_one({"vehicle_id": vehicle_id}, {"_id": 0})
    return Vehicle(**updated)

@api_router.delete("/vehicles/{vehicle_id}")
async def delete_vehicle(
    vehicle_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a vehicle"""
    result = await db.vehicles.delete_one(
        {"vehicle_id": vehicle_id, "user_id": current_user.user_id}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"message": "Vehicle deleted"}

# ===================== SERVICE ROUTES =====================

@api_router.get("/services", response_model=List[Service])
async def get_services():
    """Get all available services"""
    services = await db.services.find({"active": True}, {"_id": 0}).to_list(100)
    return [Service(**s) for s in services]

@api_router.get("/services/{service_id}", response_model=Service)
async def get_service(service_id: str):
    """Get a specific service"""
    service = await db.services.find_one({"service_id": service_id}, {"_id": 0})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return Service(**service)

# ===================== BOOKING ROUTES =====================

@api_router.get("/bookings", response_model=List[Booking])
async def get_user_bookings(current_user: User = Depends(get_current_user)):
    """Get all bookings for current user"""
    bookings = await db.bookings.find(
        {"user_id": current_user.user_id},
        {"_id": 0}
    ).sort("scheduled_date", -1).to_list(100)
    return [Booking(**b) for b in bookings]

@api_router.post("/bookings", response_model=Booking)
async def create_booking(
    booking: BookingCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new booking"""
    # Verify vehicle belongs to user
    vehicle = await db.vehicles.find_one(
        {"vehicle_id": booking.vehicle_id, "user_id": current_user.user_id},
        {"_id": 0}
    )
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    # Verify service exists
    service = await db.services.find_one({"service_id": booking.service_id}, {"_id": 0})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    new_booking = Booking(
        user_id=current_user.user_id,
        **booking.dict()
    )
    await db.bookings.insert_one(new_booking.dict())
    
    # Create initial status
    initial_status = VehicleStatus(
        booking_id=new_booking.booking_id,
        status="waiting",
        notes="Prenotazione creata"
    )
    await db.vehicle_status.insert_one(initial_status.dict())
    
    # Send email notification to officina
    user_dict = current_user.dict()
    await send_booking_notification_to_officina(new_booking.dict(), user_dict, vehicle, service)
    
    return new_booking

@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific booking"""
    booking = await db.bookings.find_one(
        {"booking_id": booking_id, "user_id": current_user.user_id},
        {"_id": 0}
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return Booking(**booking)

@api_router.delete("/bookings/{booking_id}")
async def cancel_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user)
):
    """Cancel a booking"""
    booking = await db.bookings.find_one(
        {"booking_id": booking_id, "user_id": current_user.user_id},
        {"_id": 0}
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking["status"] not in ["pending", "confirmed"]:
        raise HTTPException(status_code=400, detail="Cannot cancel this booking")
    
    await db.bookings.update_one(
        {"booking_id": booking_id},
        {"$set": {"status": "cancelled", "updated_at": datetime.now(timezone.utc)}}
    )
    return {"message": "Booking cancelled"}

# ===================== TRACKING ROUTES =====================

@api_router.get("/tracking/{booking_id}", response_model=List[VehicleStatus])
async def get_vehicle_tracking(
    booking_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get status history for a booking"""
    # Verify booking belongs to user
    booking = await db.bookings.find_one(
        {"booking_id": booking_id, "user_id": current_user.user_id},
        {"_id": 0}
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    statuses = await db.vehicle_status.find(
        {"booking_id": booking_id},
        {"_id": 0}
    ).sort("created_at", 1).to_list(100)
    
    return [VehicleStatus(**s) for s in statuses]

@api_router.get("/tracking/current/{booking_id}")
async def get_current_status(
    booking_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get current status for a booking"""
    booking = await db.bookings.find_one(
        {"booking_id": booking_id, "user_id": current_user.user_id},
        {"_id": 0}
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    status = await db.vehicle_status.find_one(
        {"booking_id": booking_id},
        {"_id": 0},
        sort=[("created_at", -1)]
    )
    
    return status

# ===================== AVAILABLE SLOTS =====================

@api_router.get("/slots")
async def get_available_slots(date: str, service_id: Optional[str] = None):
    """Get available time slots for a date"""
    # Parse date
    try:
        target_date = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    # Business hours: 8:00 - 18:00, slots every hour
    slots = []
    for hour in range(8, 18):
        slot_time = datetime.combine(target_date, datetime.min.time().replace(hour=hour))
        slot_time = slot_time.replace(tzinfo=timezone.utc)
        
        # Count bookings at this time
        existing_bookings = await db.bookings.count_documents({
            "scheduled_date": {
                "$gte": slot_time,
                "$lt": slot_time + timedelta(hours=1)
            },
            "status": {"$in": ["pending", "confirmed"]}
        })
        
        # Max 3 bookings per slot
        available = existing_bookings < 3
        
        slots.append({
            "time": f"{hour:02d}:00",
            "datetime": slot_time.isoformat(),
            "available": available,
            "spots_left": max(0, 3 - existing_bookings)
        })
    
    return {"date": date, "slots": slots}

# ===================== ADMIN ROUTES =====================

@api_router.get("/admin/bookings")
async def admin_get_all_bookings(
    status: Optional[str] = None,
    date: Optional[str] = None
):
    """Get all bookings (admin)"""
    query = {}
    if status:
        query["status"] = status
    if date:
        try:
            target_date = datetime.strptime(date, "%Y-%m-%d")
            query["scheduled_date"] = {
                "$gte": target_date,
                "$lt": target_date + timedelta(days=1)
            }
        except ValueError:
            pass
    
    bookings = await db.bookings.find(query, {"_id": 0}).sort("scheduled_date", -1).to_list(500)
    
    if not bookings:
        return []
    
    # Optimized: Batch fetch all related data to avoid N+1 queries
    user_ids = list(set(b["user_id"] for b in bookings))
    vehicle_ids = list(set(b["vehicle_id"] for b in bookings))
    service_ids = list(set(b["service_id"] for b in bookings))
    booking_ids = [b["booking_id"] for b in bookings]
    
    # Fetch all data in 4 queries instead of N*4
    users_list = await db.users.find({"user_id": {"$in": user_ids}}, {"_id": 0}).to_list(None)
    users = {u["user_id"]: u for u in users_list}
    
    vehicles_list = await db.vehicles.find({"vehicle_id": {"$in": vehicle_ids}}, {"_id": 0}).to_list(None)
    vehicles = {v["vehicle_id"]: v for v in vehicles_list}
    
    services_list = await db.services.find({"service_id": {"$in": service_ids}}, {"_id": 0}).to_list(None)
    services = {s["service_id"]: s for s in services_list}
    
    # Get latest status for each booking
    statuses = {}
    statuses_list = await db.vehicle_status.find(
        {"booking_id": {"$in": booking_ids}}, 
        {"_id": 0}
    ).sort("created_at", -1).to_list(None)
    for status_doc in statuses_list:
        if status_doc["booking_id"] not in statuses:
            statuses[status_doc["booking_id"]] = status_doc
    
    # Build enriched list using lookups
    enriched = []
    for booking in bookings:
        enriched.append({
            **booking,
            "user": users.get(booking["user_id"]),
            "vehicle": vehicles.get(booking["vehicle_id"]),
            "service": services.get(booking["service_id"]),
            "current_status": statuses.get(booking["booking_id"], {}).get("status", "waiting")
        })
    
    return enriched

@api_router.put("/admin/bookings/{booking_id}")
async def admin_update_booking(
    booking_id: str,
    update: BookingUpdate
):
    """Update booking status (admin)"""
    booking = await db.bookings.find_one({"booking_id": booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    old_status = booking.get("status")
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    await db.bookings.update_one(
        {"booking_id": booking_id},
        {"$set": update_data}
    )
    
    # Send confirmation email if status changed to confirmed
    if update.status == "confirmed" and old_status != "confirmed":
        user = await db.users.find_one({"user_id": booking["user_id"]}, {"_id": 0})
        vehicle = await db.vehicles.find_one({"vehicle_id": booking["vehicle_id"]}, {"_id": 0})
        service = await db.services.find_one({"service_id": booking["service_id"]}, {"_id": 0})
        if user and vehicle and service:
            await send_booking_confirmation_to_customer(booking, user, vehicle, service)
    
    updated = await db.bookings.find_one({"booking_id": booking_id}, {"_id": 0})
    return Booking(**updated)

@api_router.post("/admin/tracking")
async def admin_update_vehicle_status(status: VehicleStatusCreate):
    """Update vehicle status (admin)"""
    # Verify booking exists
    booking = await db.bookings.find_one({"booking_id": status.booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    new_status = VehicleStatus(**status.dict())
    await db.vehicle_status.insert_one(new_status.dict())
    
    # Update booking status based on vehicle status
    booking_status_map = {
        "waiting": "confirmed",
        "checked_in": "confirmed",
        "in_progress": "confirmed",
        "testing": "confirmed",
        "ready": "confirmed",
        "delivered": "completed"
    }
    
    new_booking_status = booking_status_map.get(status.status)
    if new_booking_status:
        await db.bookings.update_one(
            {"booking_id": status.booking_id},
            {"$set": {"status": new_booking_status, "updated_at": datetime.now(timezone.utc)}}
        )
    
    # Send status update email to customer
    user = await db.users.find_one({"user_id": booking["user_id"]}, {"_id": 0})
    vehicle = await db.vehicles.find_one({"vehicle_id": booking["vehicle_id"]}, {"_id": 0})
    if user and vehicle:
        await send_status_update_to_customer(booking, user, vehicle, status.status)
    
    return new_status

# ===================== INIT DATA =====================

@api_router.post("/init-services")
async def init_services():
    """Initialize default services"""
    default_services = [
        {
            "service_id": "srv_tagliando",
            "name": "Tagliando",
            "description": "Controllo completo e sostituzione filtri, olio motore",
            "estimated_hours": 2,
            "price_estimate": 150,
            "category": "tagliando",
            "active": True
        },
        {
            "service_id": "srv_gomme",
            "name": "Cambio Gomme",
            "description": "Sostituzione pneumatici stagionali con equilibratura",
            "estimated_hours": 1,
            "price_estimate": 60,
            "category": "gomme",
            "active": True
        },
        {
            "service_id": "srv_diagnosi",
            "name": "Diagnosi Elettronica",
            "description": "Scansione completa centralina e verifica errori",
            "estimated_hours": 0.5,
            "price_estimate": 50,
            "category": "diagnosi",
            "active": True
        },
        {
            "service_id": "srv_freni",
            "name": "Revisione Freni",
            "description": "Controllo e sostituzione pastiglie e dischi freno",
            "estimated_hours": 2,
            "price_estimate": 200,
            "category": "riparazione",
            "active": True
        },
        {
            "service_id": "srv_clima",
            "name": "Ricarica Clima",
            "description": "Ricarica gas climatizzatore e controllo perdite",
            "estimated_hours": 1,
            "price_estimate": 80,
            "category": "riparazione",
            "active": True
        },
        {
            "service_id": "srv_revisione",
            "name": "Revisione Auto",
            "description": "Revisione ministeriale obbligatoria",
            "estimated_hours": 1,
            "price_estimate": 80,
            "category": "tagliando",
            "active": True
        }
    ]
    
    for service in default_services:
        await db.services.update_one(
            {"service_id": service["service_id"]},
            {"$set": service},
            upsert=True
        )
    
    return {"message": f"Initialized {len(default_services)} services"}

# ===================== HEALTH CHECK =====================

@api_router.get("/")
async def root():
    return {"message": "Autofficina Euganea API", "status": "online"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

@api_router.get("/download/manuale")
async def download_manual():
    """Download the user manual PDF"""
    pdf_path = Path("/app/AUTOFFICINA_EUGANEA_Manuale_App.pdf")
    if not pdf_path.exists():
        raise HTTPException(status_code=404, detail="Manual not found")
    return FileResponse(
        path=pdf_path,
        filename="AUTOFFICINA_EUGANEA_Manuale_App.pdf",
        media_type="application/pdf"
    )


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
