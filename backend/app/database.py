from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import AsyncGenerator
from fastapi import Depends

DATABASE_URL = "sqlite+aiosqlite:///./decibel.db"

engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session