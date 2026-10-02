package com.empresa.gestion_empleados.dto;

import com.empresa.gestion_empleados.model.Empleado;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmpleadoRespuestaDTO {

    private Long id;
    private String nombre;
    private String email;
    private String departamento;
    private String cargo;
    private String estado;
    private String telefono;
    private String direccion;
    private LocalDate fechaContratacion;
    private List<String> habilidades = new ArrayList<>();
    private String avatar;
    private LocalDateTime creadoEn;
    private LocalDateTime actualizadoEn;

    public EmpleadoRespuestaDTO(Empleado empleado) {
        this.id = empleado.getId();
        this.nombre = empleado.getNombre();
        this.email = empleado.getEmail();
        this.departamento = empleado.getDepartamento();
        this.cargo = empleado.getCargo();
        this.estado = empleado.getEstado();
        this.telefono = empleado.getTelefono();
        this.direccion = empleado.getDireccion();
        this.fechaContratacion = empleado.getFechaContratacion();

        if (empleado.getHabilidades() != null && !empleado.getHabilidades().isEmpty()) {
            this.habilidades = List.of(empleado.getHabilidades().split(","));
        }

        this.avatar = empleado.getAvatar();
        this.creadoEn = empleado.getCreadoEn();
        this.actualizadoEn = empleado.getActualizadoEn();
    }
}