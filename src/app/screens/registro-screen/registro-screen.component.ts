import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-registro-screen',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './registro-screen.component.html',
  styleUrls: ['./registro-screen.component.scss']
})
export class RegistroScreenComponent {
  nombre: string = '';
  apellidos: string = '';
  correo: string = '';
  rol: string = 'estudiante';
  password: string = '';
  confirmPassword: string = '';

  // Propiedades requeridas por el HTML
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private reservaService: ReservaService,
    private router: Router
  ) {}

  // Restricción para permitir ÚNICAMENTE letras y espacios en vivo
  onlyLetters(event: KeyboardEvent): void {
    const char = event.key;
    // Permite letras (incluye acentos/ñ), espacio, Backspace, Delete y flechas de navegación
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
    if (!regex.test(char) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  // Métodos de cálculo dinámico de fortaleza de contraseña (retorna de 0 a 4)
  getPasswordStrength(): number {
    if (!this.password) return 0;
    let score = 0;
    if (this.password.length >= 8) score++;
    if (/[A-Z]/.test(this.password) && /[a-z]/.test(this.password)) score++;
    if (/[0-9]/.test(this.password)) score++;
    if (/[^A-Za-z0-9]/.test(this.password)) score++;
    return score;
  }

  getStrengthLabel(): string {
    const score = this.getPasswordStrength();
    switch (score) {
      case 1: return 'Insegura / Débil';
      case 2: return 'Media';
      case 3: return 'Segura';
      case 4: return 'Muy Segura';
      default: return 'Insegura';
    }
  }

  // Métodos requeridos por el HTML
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.nombre.trim() || !this.apellidos.trim() || !this.correo.trim() || !this.password) {
      alert('Por favor llena todos los campos obligatorios.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const payload = {
      nombre: `${this.nombre} ${this.apellidos}`.trim(),
      correo: this.correo.trim().toLowerCase(),
      password: this.password,
      rol: this.rol
    };

    this.reservaService.registrarUsuario(payload).subscribe({
      next: (res) => {
        alert('¡Cuenta registrada exitosamente!');
        this.router.navigate(['/sesion']);
      },
      error: (err) => {
        alert(err.error?.error || 'No se pudo crear la cuenta.');
      }
    });
  }
}