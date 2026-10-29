import { env } from 'cloudflare:workers';
export function db(){if(!env.DB)throw new Error('Le service de données est momentanément indisponible.');return env.DB;}
export function bucket(){if(!env.BUCKET)throw new Error('Le service de photos est momentanément indisponible.');return env.BUCKET;}
