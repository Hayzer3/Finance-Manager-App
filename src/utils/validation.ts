export function validateCredentials(
  email: string,
  password: string,
): string | null {
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Informe um e-mail válido.";
  if (password.length < 6)
    return "A senha precisa ter pelo menos 6 caracteres.";

  return null;
}

export function validateRegistration(
  name: string,
  email: string,
  password: string,
): string | null {
  if (name.trim().length < 2) return "Informe seu nome.";

  return validateCredentials(email, password);
}

export function validateTransaction(
  amountCents: number,
  description: string,
  category: string,
): string | null {
  if (amountCents <= 0) return "Informe um valor maior que zero.";
  if (!description.trim()) return "Informe uma descrição.";
  if (!category) return "Escolha uma categoria.";

  return null;
}
