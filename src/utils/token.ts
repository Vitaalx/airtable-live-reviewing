import { JWTPayload, SignJWT, jwtVerify } from 'jose';

interface TokenPayload extends JWTPayload {
    email: string;
}

export async function generateToken(payload: TokenPayload): Promise<string> {
  const secret = process.env.JWT_KEY;
  if (!secret) {
    throw new Error('La clé secrète JWT est manquante dans les variables d\'environnement');
  }
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h') // Exemple : expiration après 2 heures
    .sign(new TextEncoder().encode(secret)); // Utilise TextEncoder pour encoder la clé secrète
  return token;
};

export async function verifyToken(token: string): Promise<boolean> {
  const secret = process.env.JWT_KEY;
  if (!secret) {
    throw new Error('La clé secrète JWT est manquante dans les variables d\'environnement');
  }
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
      if (!payload) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }