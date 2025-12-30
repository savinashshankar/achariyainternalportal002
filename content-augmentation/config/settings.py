"""
Configuration settings for Content Augmentation Service
Loads from environment variables
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Google Cloud & Firebase
    google_cloud_project: str
    google_application_credentials: str
    google_drive_folder_id: str
    
    # Gemini AI
    gemini_api_key: str
    gemini_model: str = "gemini-2.0-flash-exp"
    
    # HeyGen
    heygen_api_key: str
    heygen_api_url: str = "https://api.heygen.com/v2"
    heygen_default_avatar_id: str
    heygen_default_voice_id: str
    
    # Optional Services
    canva_api_key: Optional[str] = None
    canva_template_id: Optional[str] = None
    pictory_api_key: Optional[str] = None
    videoscribe_api_key: Optional[str] = None
    
    # LMS Integration
    lms_api_url: str
    lms_service_api_key: str
    
    # Redis & Celery (Optional - for task queue)
    redis_url: Optional[str] = None
    celery_broker_url: Optional[str] = None
    celery_result_backend: Optional[str] = None
    
    # Content Generation Settings
    fidelity_threshold_auto_approve: float = 0.90
    fidelity_threshold_review: float = 0.70
    fidelity_threshold_reject: float = 0.60
    auto_publish_enabled: bool = True
    
    # Notifications
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None
    notification_from_email: Optional[str] = None
    
    # Monitoring
    sentry_dsn: Optional[str] = None
    log_level: str = "INFO"
    
    # Environment
    debug: bool = False
    environment: str = "production"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
