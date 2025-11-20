// app/admin/layout.js - Protection centrale pour TOUT le dossier /admin
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_PASSWORD = 'Winshop2025'; // Change ce mot de passe fort !

export default function AdminLayout({ children }) {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('admin-auth');

  // Vérif stricte côté serveur : pas de cookie = redirection login
  if (!authCookie || authCookie.value !== ADMIN_PASSWORD) {
    redirect('/admin/login');
  }

  // Si OK, on affiche le contenu avec un header admin basique
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin WINSHOP 🔐</h1>
          <a 
            href="/api/admin/logout" 
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
          >
            Déconnexion
          </a>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
