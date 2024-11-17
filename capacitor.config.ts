import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter', // Identificador único do app
  appName: 'TourMate',       // Nome do aplicativo
  webDir: 'www',             // Diretório dos arquivos web
  bundledWebRuntime: false,  // Usa o runtime nativo do Capacitor

  plugins: {
    // Configuração específica para a câmera
    Camera: {
      allowEditing: false, // Define se o usuário pode editar a foto após capturá-la
      saveToGallery: true, // Salva as fotos na galeria do dispositivo
      resultType: 'base64', // Retorna as imagens como base64
    },
  },
};

export default config;
