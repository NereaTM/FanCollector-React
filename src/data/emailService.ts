import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

const TEMPLATES = {
  contacto: import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string,
  newsletter: import.meta.env.VITE_EMAILJS_NEWSLETTER_TEMPLATE_USER as string,
};

// Contacto
export type ContactoParams = {
  name: string;
  from_email: string;
  message: string;
};

export type NewsletterParams = {
  email: string;
};

export async function enviarContacto(params: ContactoParams): Promise<void> {
  await emailjs.send(SERVICE_ID, TEMPLATES.contacto, {
    name: params.name,
    from_email: params.from_email,
    message: params.message,
  }, PUBLIC_KEY);
}

export async function enviarNewsletter(params: NewsletterParams): Promise<void> {
  await emailjs.send(SERVICE_ID, TEMPLATES.newsletter, {
    para_email: params.email,
    nombre: params.email,
    email: params.email,
  }, PUBLIC_KEY);
}
