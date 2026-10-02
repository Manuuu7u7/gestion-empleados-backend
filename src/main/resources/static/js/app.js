let paginaActual = 1;
const itemsPorPagina = 5;
let todosLosEmpleados = [];
let empleadosFiltrados = [];
let editandoId = null;

const cuerpoTabla = document.getElementById('cuerpoTabla');
const buscarInput = document.getElementById('buscarInput');
const filtroDepartamento = document.getElementById('filtroDepartamento');
const modal = document.getElementById('modalEmpleado');
const tituloModal = document.getElementById('tituloModal');
const formularioEmpleado = document.getElementById('formularioEmpleado');
const cerrarModalBtn = document.getElementById('cerrarModal');
const btnCancelar = document.getElementById('btnCancelar');
const btnRegistrar = document.getElementById('btnRegistrar');
const paginaAnteriorBtn = document.getElementById('paginaAnterior');
const paginaSiguienteBtn = document.getElementById('paginaSiguiente');
const infoPagina = document.getElementById('infoPagina');
const btnGuardar = document.getElementById('btnGuardar');

const API_URL = 'http://localhost:8080/api/empleados';

async function obtenerEmpleados() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar empleados');
        todosLosEmpleados = await response.json();
        empleadosFiltrados = [...todosLosEmpleados];
        renderizarEmpleados();
    } catch (error) {
        console.error('Error:', error);
        mostrarToast('Error al cargar empleados', 'error');
    }
}

async function crearEmpleado(datosEmpleado) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosEmpleado)
        });
        if (!response.ok) throw new Error('Error al crear empleado');
        const nuevoEmpleado = await response.json();
        todosLosEmpleados.push(nuevoEmpleado);
        empleadosFiltrados = [...todosLosEmpleados];
        renderizarEmpleados();
        mostrarToast('✅ Empleado registrado exitosamente', 'exito');
        cerrarModal();
    } catch (error) {
        console.error('Error:', error);
        mostrarToast('❌ Error al registrar empleado', 'error');
    }
}

async function actualizarEmpleado(id, datosEmpleado) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosEmpleado)
        });
        if (!response.ok) throw new Error('Error al actualizar empleado');
        const empleadoActualizado = await response.json();
        const index = todosLosEmpleados.findIndex(emp => emp.id === id);
        if (index !== -1) {
            todosLosEmpleados[index] = empleadoActualizado;
        }
        empleadosFiltrados = [...todosLosEmpleados];
        renderizarEmpleados();
        mostrarToast('✅ Empleado actualizado exitosamente', 'exito');
        cerrarModal();
    } catch (error) {
        console.error('Error:', error);
        mostrarToast('❌ Error al actualizar empleado', 'error');
    }
}

async function eliminarEmpleado(id) {
    if (!confirm('¿Estás seguro de eliminar este empleado?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar empleado');

        todosLosEmpleados = todosLosEmpleados.filter(emp => emp.id !== id);
        empleadosFiltrados = [...todosLosEmpleados];
        renderizarEmpleados();
        mostrarToast('🗑️ Empleado eliminado', 'exito');
    } catch (error) {
        console.error('Error:', error);
        mostrarToast('❌ Error al eliminar empleado', 'error');
    }
}

function renderizarEmpleados() {
    const startIndex = (paginaActual - 1) * itemsPorPagina;
    const endIndex = startIndex + itemsPorPagina;
    const pageItems = empleadosFiltrados.slice(startIndex, endIndex);

    if (empleadosFiltrados.length === 0) {
        cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding: 50px; color: #868e96;">
                    <i class="fas fa-users" style="font-size: 48px; display:block; margin-bottom: 12px; opacity: 0.3;"></i>
                    No hay empleados registrados
                </td>
            </tr>
        `;
        actualizarPaginacion();
        return;
    }

    cuerpoTabla.innerHTML = pageItems.map(empleado => `
        <tr>
            <td>
                <div class="info-empleado">
                    <div class="avatar-empleado">
                        ${empleado.nombre ? empleado.nombre.charAt(0).toUpperCase() : 'E'}
                    </div>
                    <div>
                        <div class="nombre-empleado">${empleado.nombre || 'Sin nombre'}</div>
                        <div style="font-size: 11px; color: #adb5bd;">ID: ${empleado.id}</div>
                    </div>
                </div>
            </td>
            <td>${empleado.email || 'Sin email'}</td>
            <td>${empleado.departamento || 'No asignado'}</td>
            <td>${empleado.cargo || 'Sin cargo'}</td>
            <td>
                <span class="etiqueta-estado ${empleado.estado === 'ACTIVO' ? 'estado-activo' : 'estado-inactivo'}">
                    ${empleado.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td style="text-align:center; white-space:nowrap;">
                <button class="btn btn-ver" onclick="verEmpleado(${empleado.id})" title="Ver detalle">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-editar" onclick="editarEmpleado(${empleado.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-eliminar" onclick="eliminarEmpleado(${empleado.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    actualizarPaginacion();
}

function actualizarPaginacion() {
    const totalPaginas = Math.ceil(empleadosFiltrados.length / itemsPorPagina);
    infoPagina.textContent = `Página ${paginaActual} de ${totalPaginas || 1}`;
    paginaAnteriorBtn.disabled = paginaActual <= 1;
    paginaSiguienteBtn.disabled = paginaActual >= totalPaginas;
}

function abrirModal() {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    editandoId = null;
    formularioEmpleado.reset();
    document.getElementById('empleadoId').value = '';
    document.getElementById('contrasena').required = true;
    document.getElementById('contrasena').placeholder = 'Mínimo 6 caracteres';
    tituloModal.innerHTML = '<i class="fas fa-user-plus" style="color: #4361ee; margin-right: 10px;"></i> Registrar Empleado';
}

function verEmpleado(id) {
    const empleado = todosLosEmpleados.find(emp => emp.id === id);
    if (!empleado) {
        mostrarToast('Empleado no encontrado', 'error');
        return;
    }

    const habilidades = empleado.habilidades && empleado.habilidades.length > 0
        ? empleado.habilidades.join(', ')
        : 'No registradas';

    alert(`
📋 DETALLE DEL EMPLEADO
──────────────────────
ID: ${empleado.id}
Nombre: ${empleado.nombre}
Email: ${empleado.email}
Departamento: ${empleado.departamento || 'No asignado'}
Cargo: ${empleado.cargo || 'Sin cargo'}
Estado: ${empleado.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'}
Teléfono: ${empleado.telefono || 'No registrado'}
Fecha Contratación: ${empleado.fechaContratacion || 'No registrada'}
Habilidades: ${habilidades}
Dirección: ${empleado.direccion || 'No registrada'}
    `);
}

function editarEmpleado(id) {
    const empleado = todosLosEmpleados.find(emp => emp.id === id);
    if (!empleado) {
        mostrarToast('Empleado no encontrado', 'error');
        return;
    }

    editandoId = id;
    tituloModal.innerHTML = '<i class="fas fa-user-edit" style="color: #fcc419; margin-right: 10px;"></i> Editar Empleado';
    document.getElementById('empleadoId').value = id;
    document.getElementById('nombre').value = empleado.nombre || '';
    document.getElementById('email').value = empleado.email || '';
    document.getElementById('contrasena').value = '';
    document.getElementById('contrasena').required = false;
    document.getElementById('contrasena').placeholder = 'Dejar vacío para mantener';
    document.getElementById('departamento').value = empleado.departamento || '';
    document.getElementById('cargo').value = empleado.cargo || '';
    document.getElementById('estado').value = empleado.estado || 'ACTIVO';
    document.getElementById('telefono').value = empleado.telefono || '';
    document.getElementById('fechaContratacion').value = empleado.fechaContratacion || '';
    document.getElementById('habilidades').value = empleado.habilidades ? empleado.habilidades.join(', ') : '';
    document.getElementById('direccion').value = empleado.direccion || '';

    abrirModal();
}

function abrirModalRegistro() {
    editandoId = null;
    tituloModal.innerHTML = '<i class="fas fa-user-plus" style="color: #4361ee; margin-right: 10px;"></i> Registrar Empleado';
    formularioEmpleado.reset();
    document.getElementById('empleadoId').value = '';
    document.getElementById('contrasena').required = true;
    document.getElementById('contrasena').placeholder = 'Mínimo 6 caracteres';
    document.getElementById('estado').value = 'ACTIVO';
    abrirModal();
}

function mostrarToast(mensaje, tipo) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.textContent = mensaje;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
});

cerrarModalBtn.addEventListener('click', cerrarModal);
btnCancelar.addEventListener('click', cerrarModal);
btnRegistrar.addEventListener('click', abrirModalRegistro);

formularioEmpleado.addEventListener('submit', async (e) => {
    e.preventDefault();

    btnGuardar.disabled = true;
    btnGuardar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    try {
        const habilidades = document.getElementById('habilidades').value
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        const datosEmpleado = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            contrasena: document.getElementById('contrasena').value,
            departamento: document.getElementById('departamento').value,
            cargo: document.getElementById('cargo').value,
            estado: document.getElementById('estado').value,
            telefono: document.getElementById('telefono').value,
            fechaContratacion: document.getElementById('fechaContratacion').value || null,
            habilidades: habilidades,
            direccion: document.getElementById('direccion').value
        };

        if (editandoId) {
            await actualizarEmpleado(editandoId, datosEmpleado);
        } else {
            await crearEmpleado(datosEmpleado);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar';
    }
});

paginaAnteriorBtn.addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        renderizarEmpleados();
    }
});

paginaSiguienteBtn.addEventListener('click', () => {
    const totalPaginas = Math.ceil(empleadosFiltrados.length / itemsPorPagina);
    if (paginaActual < totalPaginas) {
        paginaActual++;
        renderizarEmpleados();
    }
});

buscarInput.addEventListener('input', () => {
    const query = buscarInput.value.toLowerCase();
    empleadosFiltrados = todosLosEmpleados.filter(emp =>
        emp.nombre.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query)
    );
    paginaActual = 1;
    renderizarEmpleados();
});

filtroDepartamento.addEventListener('change', () => {
    const dept = filtroDepartamento.value;
    if (dept) {
        empleadosFiltrados = todosLosEmpleados.filter(emp => emp.departamento === dept);
    } else {
        empleadosFiltrados = [...todosLosEmpleados];
    }
    paginaActual = 1;
    renderizarEmpleados();
});

obtenerEmpleados();

window.verEmpleado = verEmpleado;
window.editarEmpleado = editarEmpleado;
window.eliminarEmpleado = eliminarEmpleado;