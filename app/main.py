from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

import app.models  # noqa: F401
from app.core.config import settings
from app.core.database import check_database, engine
from app.routers import auth, businesses, export, health, hsn, invoices, oauth, subscriptions, whatsapp

logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    application = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="WhatsApp-first AI invoice processing for Indian businesses.",
        debug=settings.debug,
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.add_middleware(SessionMiddleware, secret_key=settings.jwt_secret)

    prefix = settings.api_v1_prefix
    application.include_router(health.router, prefix=prefix)
    application.include_router(auth.router, prefix=prefix)
    application.include_router(oauth.router, prefix=prefix)
    application.include_router(export.router, prefix=prefix)
    application.include_router(invoices.router, prefix=prefix)
    application.include_router(businesses.router, prefix=prefix)
    application.include_router(whatsapp.router, prefix=prefix)
    application.include_router(hsn.router, prefix=prefix)
    application.include_router(subscriptions.router, prefix=prefix)

    @application.get("/", include_in_schema=False)
    def root() -> dict:
        return {
            "app": settings.app_name,
            "version": settings.app_version,
            "health": f"{prefix}/health",
        }

    return application


app = create_app()
