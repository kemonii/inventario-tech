export async function obtenerDashboard() {

  const response =
    await fetch("/api/dashboard");

  if (!response.ok) {
    throw new Error(
      "No se pudieron cargar los datos"
    );
  }

  return response.json();
}