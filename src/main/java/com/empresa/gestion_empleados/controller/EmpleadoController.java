package com.empresa.gestion_empleados.controller;

import com.empresa.gestion_empleados.dto.EmpleadoDTO;
import com.empresa.gestion_empleados.dto.EmpleadoRespuestaDTO;
import com.empresa.gestion_empleados.model.Empleado;
import com.empresa.gestion_empleados.service.EmpleadoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/empleados")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmpleadoController {

    private final EmpleadoService empleadoServicio;

    @GetMapping
    public ResponseEntity<List<EmpleadoRespuestaDTO>> obtenerTodosLosEmpleados() {
        List<Empleado> empleados = empleadoServicio.obtenerTodosLosEmpleados();
        List<EmpleadoRespuestaDTO> respuesta = empleados.stream()
                .map(EmpleadoRespuestaDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerEmpleadoPorId(@PathVariable Long id) {
        Optional<Empleado> empleadoOpt = empleadoServicio.obtenerEmpleadoPorId(id);

        if (empleadoOpt.isPresent()) {
            return ResponseEntity.ok(new EmpleadoRespuestaDTO(empleadoOpt.get()));
        } else {
            Map<String, Object> error = new HashMap<>();
            error.put("timestamp", LocalDateTime.now().toString());
            error.put("status", 404);
            error.put("error", "No encontrado");
            error.put("mensaje", "Empleado no encontrado con ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @PostMapping
    public ResponseEntity<?> crearEmpleado(@Valid @RequestBody EmpleadoDTO empleadoDTO) {
        if (empleadoServicio.existePorEmail(empleadoDTO.getEmail())) {
            Map<String, Object> error = new HashMap<>();
            error.put("timestamp", LocalDateTime.now().toString());
            error.put("status", 400);
            error.put("error", "Email duplicado");
            error.put("mensaje", "Ya existe un empleado con el email: " + empleadoDTO.getEmail());
            return ResponseEntity.badRequest().body(error);
        }

        try {
            Empleado creado = empleadoServicio.crearEmpleado(empleadoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(new EmpleadoRespuestaDTO(creado));
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("timestamp", LocalDateTime.now().toString());
            error.put("status", 500);
            error.put("error", "Error al crear");
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarEmpleado(
            @PathVariable Long id,
            @Valid @RequestBody EmpleadoDTO empleadoDTO) {
        try {
            Empleado actualizado = empleadoServicio.actualizarEmpleado(id, empleadoDTO);
            return ResponseEntity.ok(new EmpleadoRespuestaDTO(actualizado));
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("timestamp", LocalDateTime.now().toString());
            error.put("status", 404);
            error.put("error", "No encontrado");
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEmpleado(@PathVariable Long id) {
        try {
            empleadoServicio.eliminarEmpleado(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("timestamp", LocalDateTime.now().toString());
            error.put("status", 500);
            error.put("error", "Error al eliminar");
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<EmpleadoRespuestaDTO>> buscarEmpleados(@RequestParam String q) {
        List<Empleado> empleados = empleadoServicio.buscarEmpleados(q);
        List<EmpleadoRespuestaDTO> respuesta = empleados.stream()
                .map(EmpleadoRespuestaDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(respuesta);
    }
}