import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../services/reserva.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sesion-screen',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './sesion-screen.component.html',
  styleUrls: ['./sesion-screen.component.scss']
})
export class SesionScreenComponent {
  showError: boolean = false;
  emailError: boolean = false;
  showPassword: boolean = false;
  correo: string = '';
  password: string = '';

  constructor(
    private reservaService: ReservaService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.correo || !this.password) {
      alert('Por favor ingresa tu correo y contraseña.');
      return;
    }

    const payload = {
      correo: this.correo.trim().toLowerCase(),
      password: this.password
    };

    this.reservaService.loginUsuario(payload).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this.router.navigate(['/dashboard']); // Redirige a la ruta definida en AppRoutingModule
      },
      error: (err) => {
        alert(err.error?.error || 'Credenciales incorrectas.');
      }
    });
  }
}