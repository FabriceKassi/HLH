import html from '../public/index.html?raw';
import { privateRobotsHeader, withSiteSeo } from '../lib/seo';
export async function GET(){return new Response(withSiteSeo(html,'/'),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache','X-Robots-Tag':privateRobotsHeader}})}
