import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReservaPayload {
  usuario_id: number;
  laboratorio_id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  aforo: number;
  version_actual: number;
}

export interface RegistroPayload {
  nombre: string;
  correo: string;
  password_hash?: string;
  password?: string;
  rol?: string;
}

export interface LoginPayload {
  correo: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // RF-01: AUTENTICACIÓN
  // Registro de usuario
  registrarUsuario(datosUsuario: RegistroPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/registro`, datosUsuario);
  }

  // Login de usuario (retorna Token JWT)
  loginUsuario(credenciales: LoginPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credenciales);
  }

  // RF-02 & ALGORITMO: DISPONIBILIDAD Y RECOMENDACIÓN
  // Obtener disponibilidad en tiempo real por fecha
  obtenerDisponibilidad(fecha: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/disponibilidad?fecha=${fecha}`);
  }

  // Recomendar mejor sala basada en aforo y horario
  recomendarSala(criterios: { fecha: string; hora_inicio: string; hora_fin: string; aforo: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/recomendar-sala`, criterios);
  }

  // RF-03 & RF-04: RESERVAS CON OPTIMISTIC LOCKING
  // Enviar reserva a Express con validación de solapamiento y versión de fila
  crearReserva(datosReserva: ReservaPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservar`, datosReserva);
  }

  // RF-05 & RF-07: CANCELACIÓN E HISTORIAL
  // Obtener historial de reservas del usuario logueado
  obtenerHistorialUsuario(usuarioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reservas/usuario/${usuarioId}`);
  }

  // Cancelar reserva (mínimo 2 horas de anticipación)
  cancelarReserva(reservaId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/reservas/cancelar/${reservaId}`, {});
  }
}