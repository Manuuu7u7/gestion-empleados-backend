package com.empresa.gestion_empleados.service;

import com.empresa.gestion_empleados.dto.EmpleadoDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SyncService {

    @Value("${SYNC_URL:}")
    private String syncUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Sincroniza un empleado con el backend local (XAMPP)
     * Si SYNC_URL no está configurada, no hace nada
     */
    public void sincronizarEmpleado(EmpleadoDTO empleado) {
        if (syncUrl == null || syncUrl.isEmpty()) {
            System.out.println("⚠️ SYNC_URL no configurada, saltando sincronización");
            return;
        }

        try {
            System.out.println("🔄 Sincronizando con: " + syncUrl);
            restTemplate.postForObject(syncUrl, empleado, String.class);
            System.out.println("✅ Sincronización exitosa");
        } catch (Exception e) {
            System.err.println("❌ Error en sincronización: " + e.getMessage());
            // No lanzamos excepción para que el guardado principal no falle
        }
    }
}