package com.empresa.gestion_empleados.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmpleadoDTO {

    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe ser válido")
    @Size(max = 100, message = "El email no puede tener más de 100 caracteres")
    private String email;

    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String contrasena;

    @Size(max = 50, message = "El departamento no puede tener más de 50 caracteres")
    private String departamento;

    @Size(max = 50, message = "El cargo no puede tener más de 50 caracteres")
    private String cargo;

    private String estado = "ACTIVO";

    @Pattern(regexp = "^[+]?[0-9]{7,15}$", message = "El teléfono debe tener entre 7 y 15 dígitos")
    private String telefono;

    @Size(max = 255, message = "La dirección no puede tener más de 255 caracteres")
    private String direccion;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaContratacion;

    private List<String> habilidades;

    @Size(max = 255, message = "El avatar no puede tener más de 255 caracteres")
    private String avatar;
}