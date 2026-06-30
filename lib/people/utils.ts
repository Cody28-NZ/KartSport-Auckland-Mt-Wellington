export function isJuniorPerson(dateOfBirth: string | null | undefined): boolean {
  if (!dateOfBirth) return false;
  const dob = new Date(`${dateOfBirth}T12:00:00`);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age < 18;
}

/** @deprecated Use isJuniorPerson */
export const isJuniorDriver = isJuniorPerson;
