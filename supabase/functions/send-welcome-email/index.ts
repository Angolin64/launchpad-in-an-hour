import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  firstName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName }: WelcomeEmailRequest = await req.json();

    console.log("Sending welcome email to:", email);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const displayName = firstName || email.split('@')[0];

    const emailResponse = await resend.emails.send({
      from: "Launchin60 <noreply@launchin60.com>",
      to: [email],
      subject: "¡Bienvenido a Launchin60! 🚀",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 16px;
              padding: 40px;
              color: white;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .content {
              background: white;
              border-radius: 12px;
              padding: 30px;
              color: #333;
              margin-top: -20px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 14px 32px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 600;
              margin: 20px 0;
            }
            .feature {
              margin: 15px 0;
              padding-left: 30px;
              position: relative;
            }
            .feature:before {
              content: "✓";
              position: absolute;
              left: 0;
              color: #667eea;
              font-weight: bold;
              font-size: 20px;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 14px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🚀 Launchin60</div>
            <h1 style="margin: 0; font-size: 28px;">¡Bienvenido, ${displayName}!</h1>
            <p style="margin-top: 10px; opacity: 0.95;">Tu cuenta ha sido creada exitosamente</p>
          </div>
          
          <div class="content">
            <h2 style="color: #667eea; margin-top: 0;">¡Estás listo para lanzar tu proyecto! 🎉</h2>
            
            <p>Gracias por unirte a Launchin60. Estamos emocionados de ayudarte a lanzar tu proyecto en tiempo récord.</p>
            
            <h3 style="color: #764ba2;">¿Qué puedes hacer ahora?</h3>
            
            <div class="feature">
              <strong>Crea tu primer proyecto</strong><br>
              Completa nuestro formulario guiado para definir tu lanzamiento
            </div>
            
            <div class="feature">
              <strong>Genera contenido con IA</strong><br>
              Crea contenido profesional para redes sociales, emails y más
            </div>
            
            <div class="feature">
              <strong>Chatbot inteligente</strong><br>
              Configura un asistente virtual para interactuar con tus clientes
            </div>
            
            <div class="feature">
              <strong>Exporta a Canva</strong><br>
              Diseña contenido visual profesional con un solo clic
            </div>
            
            <center>
              <a href="https://launchin60.com/dashboard" class="button">
                Ir al Dashboard
              </a>
            </center>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              <strong>Tip:</strong> Completa el formulario de lanzamiento con toda la información de tu proyecto para obtener los mejores resultados.
            </p>
          </div>
          
          <div class="footer">
            <p>
              Este email fue enviado desde <strong>Launchin60</strong><br>
              Si no creaste esta cuenta, puedes ignorar este mensaje.
            </p>
            <p style="margin-top: 15px;">
              <a href="https://launchin60.com" style="color: #667eea; text-decoration: none;">launchin60.com</a>
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
¡Bienvenido a Launchin60, ${displayName}!

Tu cuenta ha sido creada exitosamente. Estamos emocionados de ayudarte a lanzar tu proyecto en tiempo récord.

¿Qué puedes hacer ahora?

✓ Crea tu primer proyecto - Completa nuestro formulario guiado
✓ Genera contenido con IA - Crea contenido profesional automáticamente
✓ Chatbot inteligente - Configura un asistente virtual
✓ Exporta a Canva - Diseña contenido visual profesional

Visita tu dashboard: https://launchin60.com/dashboard

Tip: Completa el formulario de lanzamiento con toda la información de tu proyecto para obtener los mejores resultados.

---
Este email fue enviado desde Launchin60
Si no creaste esta cuenta, puedes ignorar este mensaje.

launchin60.com
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
