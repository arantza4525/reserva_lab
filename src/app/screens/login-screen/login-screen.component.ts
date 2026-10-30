import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../services/reserva.service';

export interface SlotState {
  status: 'disponible' | 'ocupado' | 'seleccionado' | 'pasado';
  label: string;
}

export interface RoomSchedule {
  id: number;
  name: string;
  capacity: string;
  location: string;
  version: number; // Para Optimistic Locking (RF-04)
  slots: { [timeRange: string]: SlotState };
}

export interface PendingBooking {
  roomId: number;
  roomName: string;
  date: string;
  timeRange: string;
  startTime: string;
  endTime: string;
  duration: string;
  requestedCapacity: string;
  maxCapacity: string;
  version: number;
}

export interface UserBooking {
  id: number;
  laboratorio: string;
  ubicacion: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  aforo_solicitado: number;
  estado: 'confirmada' | 'cancelada';
}

@Component({
  selector: 'app-login-screen',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit {

  constructor(
    private reservaService: ReservaService,
    private router: Router
  ) {}

  currentUser = {
    id: 1, // Usuario logueado por defecto
    name: 'Arantza G.',
    role: 'Estudiante'
  };

  activeTab: 'dia' | 'semana' | 'mis-reservas' = 'dia';

  // Fechas para control de restricciones
  todayDateStr: string = '';
  minDate: string = '';
  selectedDate: string = '';

  isUserMenuOpen: boolean = false;
  isDarkMode: boolean = false;
  isLoading: boolean = false;

  // Filtros seleccionados
  selectedStartTime: string = '07:00';
  selectedEndTime: string = '09:00';
  selectedCapacity: string = '10 personas';

  showRecommendation: boolean = true;

  // Lista de reservas del historial
  userBookings: UserBooking[] = [];

  // Estado del Modal de Confirmación
  isConfirmModalOpen: boolean = false;
  pendingBooking: PendingBooking | null = null;

  timeRows: string[] = [
    '07:00–09:00',
    '09:00–11:00',
    '11:00–13:00',
    '13:00–15:00',
    '15:00–17:00',
    '17:00–19:00'
  ];
  rooms: RoomSchedule[] = [];

  // Recomendación de salas
  recommendationData: any = null;
  recommendedRoomId: number | null = null;

  ngOnInit(): void {
    // 1. Obtener datos del usuario desde localStorage si está logueado
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const user = JSON.parse(usuarioGuardado);
      this.currentUser = {
        id: user.id,
        name: user.nombre,
        role: user.rol ? user.rol.charAt(0).toUpperCase() + user.rol.slice(1) : 'Estudiante'
      };
    }

    // 2. Establecer fecha mínima para no permitir reservas pasadas
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    this.todayDateStr = `${year}-${month}-${day}`;
    this.minDate = this.todayDateStr;
    this.selectedDate = this.todayDateStr;

    // 3. Restaurar tema oscuro
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark-theme');
    }

    this.fetchDataFromDatabase();
    this.fetchUserBookings();
  }

  /**
   * Cambia la pestaña activa (Día / Mis Reservas)
   */
  setTab(tab: 'dia' | 'semana' | 'mis-reservas'): void {
    this.activeTab = tab;
    if (tab === 'mis-reservas') {
      this.fetchUserBookings();
    }
  }

  /**
   * Carga la disponibilidad en tiempo real desde la API Express (RF-02)
   */
  fetchDataFromDatabase(): void {
    this.isLoading = true;

    this.reservaService.obtenerDisponibilidad(this.selectedDate).subscribe({
      next: (data) => {
        const ahora = new Date();
        const esHoy = this.selectedDate === this.todayDateStr;

        if (data && data.laboratorios) {
          this.rooms = data.laboratorios.map((lab: any) => {
            const slotsMap: { [key: string]: SlotState } = {};

            this.timeRows.forEach((time) => {
              const key = time.replace('–', '-');
              const [inicio, fin] = key.split('-');

              // Validar si la hora ya pasó en el día de hoy
              const [horaInicioNum] = inicio.split(':').map(Number);
              const horaExpirada = esHoy && horaInicioNum <= ahora.getHours();

              if (horaExpirada) {
                slotsMap[key] = { status: 'pasado', label: 'Horario expirado' };
              } else {
                const estaOcupado = lab.reservas?.some((r: any) => 
                  (r.hora_inicio < fin && r.hora_fin > inicio)
                );

                slotsMap[key] = estaOcupado
                  ? { status: 'ocupado', label: 'Reserva académica' }
                  : { status: 'disponible', label: '+ Reservar' };
              }
            });

            return {
              id: lab.id,
              name: lab.nombre,
              capacity: `${lab.capacidad} plazas`,
              location: lab.ubicacion,
              version: lab.version || 1,
              slots: slotsMap
            };
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.warn('API no disponible. Usando datos locales de respaldo:', err);
        const ahora = new Date();
        const esHoy = this.selectedDate === this.todayDateStr;

        this.rooms = [
          {
            id: 1,
            name: 'Laboratorio 101',
            capacity: '24 plazas',
            location: 'Edificio A · Planta 1',
            version: 1,
            slots: {
              '07:00-09:00': esHoy && 7 <= ahora.getHours() ? { status: 'pasado', label: 'Horario expirado' } : { status: 'ocupado', label: 'Reserva académica' },
              '09:00-11:00': { status: 'disponible', label: '+ Reservar' },
              '11:00-13:00': { status: 'disponible', label: '+ Reservar' },
              '13:00-15:00': { status: 'disponible', label: '+ Reservar' },
              '15:00-17:00': { status: 'disponible', label: '+ Reservar' },
              '17:00-19:00': { status: 'disponible', label: '+ Reservar' }
            }
          },
          {
            id: 2,
            name: 'Lab de Cómputo B',
            capacity: '30 plazas',
            location: 'Edificio B · Planta 2',
            version: 1,
            slots: {
              '07:00-09:00': { status: 'disponible', label: '+ Reservar' },
              '09:00-11:00': { status: 'disponible', label: '+ Reservar' },
              '11:00-13:00': { status: 'disponible', label: '+ Reservar' },
              '13:00-15:00': { status: 'disponible', label: '+ Reservar' },
              '15:00-17:00': { status: 'disponible', label: '+ Reservar' },
              '17:00-19:00': { status: 'disponible', label: '+ Reservar' }
            }
          },
          {
            id: 3,
            name: 'Sala de Estudio A',
            capacity: '12 plazas',
            location: 'Biblioteca · Planta 1',
            version: 1,
            slots: {
              '07:00-09:00': { status: 'disponible', label: '+ Reservar' },
              '09:00-11:00': { status: 'disponible', label: '+ Reservar' },
              '11:00-13:00': { status: 'disponible', label: '+ Reservar' },
              '13:00-15:00': { status: 'disponible', label: '+ Reservar' },
              '15:00-17:00': { status: 'seleccionado', label: 'Lista para confirmar' },
              '17:00-19:00': { status: 'ocupado', label: 'Reserva académica' }
            }
          }
        ];
        this.isLoading = false;
      }
    });
  }

  /**
   * Obtiene el historial de reservas del usuario (RF-07)
   */
  fetchUserBookings(): void {
    this.reservaService.obtenerHistorialUsuario(this.currentUser.id).subscribe({
      next: (data) => {
        this.userBookings = data;
      },
      error: (err) => console.error('Error al obtener historial:', err)
    });
  }

  /**
   * Cancelar reserva con validación de 2 horas (RF-05)
   */
  cancelBooking(bookingId: number): void {
    if (confirm('¿Estás seguro/a de que deseas cancelar esta reserva?')) {
      this.reservaService.cancelarReserva(bookingId).subscribe({
        next: (res) => {
          alert(res.mensaje);
          this.fetchUserBookings();
          this.fetchDataFromDatabase();
        },
        error: (err) => {
          alert(err.error?.error || 'No se pudo cancelar la reserva.');
        }
      });
    }
  }

  onDateChange(): void {
    if (this.selectedDate < this.minDate) {
      alert('No es posible seleccionar fechas pasadas.');
      this.selectedDate = this.minDate;
    }
    this.fetchDataFromDatabase();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/sesion']);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  getSlot(room: RoomSchedule, timeRange: string): SlotState {
    const key = timeRange.replace('–', '-');
    return room.slots[key] || { status: 'disponible', label: '+ Reservar' };
  }

  selectSlot(room: RoomSchedule, timeRange: string): void {
    const key = timeRange.replace('–', '-');
    const slot = room.slots[key];

    if (slot && slot.status === 'disponible') {
      slot.status = 'seleccionado';
      slot.label = 'Lista para confirmar';

      const [inicio, fin] = key.split('-');

      this.pendingBooking = {
        roomId: room.id,
        roomName: room.name,
        date: this.selectedDate,
        timeRange: timeRange,
        startTime: inicio,
        endTime: fin,
        duration: '2 horas',
        requestedCapacity: this.selectedCapacity,
        maxCapacity: room.capacity,
        version: room.version
      };

      this.isConfirmModalOpen = true;
    }
  }

  closeConfirmModal(): void {
    this.isConfirmModalOpen = false;
    this.fetchDataFromDatabase();
  }

  /**
   * Envía la confirmación de reserva a la API de Express (RF-03, RF-04)
   */
  confirmBooking(): void {
    if (this.pendingBooking) {
      const payload = {
        usuario_id: this.currentUser.id,
        laboratorio_id: this.pendingBooking.roomId,
        fecha: this.selectedDate,
        hora_inicio: this.pendingBooking.startTime,
        hora_fin: this.pendingBooking.endTime,
        aforo: parseInt(this.selectedCapacity),
        version_actual: this.pendingBooking.version
      };

      this.reservaService.crearReserva(payload).subscribe({
        next: (res) => {
          alert('¡Reserva creada exitosamente en la base de datos!');
          this.isConfirmModalOpen = false;
          this.fetchDataFromDatabase();
          this.fetchUserBookings();
        },
        error: (err) => {
          alert(err.error?.error || 'No se pudo completar la reserva. Intenta nuevamente.');
          this.isConfirmModalOpen = false;
          this.fetchDataFromDatabase();
        }
      });
    }
  }

  /**
   * Consulta a Express la mejor sala según fecha, horario y aforo seleccionado
   */
  recomendarSala(): void {
    const aforoNum = parseInt(this.selectedCapacity) || 10;

    const payload = {
      fecha: this.selectedDate,
      hora_inicio: this.selectedStartTime,
      hora_fin: this.selectedEndTime,
      aforo: aforoNum
    };

    this.reservaService.recomendarSala(payload).subscribe({
      next: (res) => {
        if (res && res.mejor_opcion) {
          const sala = res.mejor_opcion;
          this.recommendedRoomId = sala.id;

          this.recommendationData = {
            id: sala.id,
            nombre: sala.nombre,
            capacidad: sala.capacidad,
            ubicacion: sala.ubicacion,
            horario: `${this.selectedStartTime}–${this.selectedEndTime}`,
            aforoRequerido: aforoNum
          };
          this.showRecommendation = true;
        }
      },
      error: (err) => {
        this.recommendedRoomId = null;
        const msj = err.error?.mensaje || 'No hay salas disponibles con esa capacidad en el horario seleccionado.';
        alert(msj);
      }
    });
  }

  /**
   * Lleva al usuario directamente a la tabla del calendario y enfoca la pestaña 'dia'
   */
  verEnCalendario(event: Event): void {
    event.preventDefault();
    this.activeTab = 'dia';

    const calendarElement = document.querySelector('.calendar-card');
    if (calendarElement) {
      calendarElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}