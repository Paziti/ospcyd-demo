export type ContactTopic = "credencial" | "autorizaciones" | "cartilla" | "datos" | "otro";

export interface ContactMessage {
  topic: ContactTopic;
  message: string;
  replyTo: "email" | "telefono";
}

export interface ContactReceipt {
  ticket: string;
}
