import { Component } from '@angular/core';
import { FooterComponent } from '@partials/footer/footer.component';
import { NavbarComponent } from '@partials/navbar/navbar.component';


interface FaqItem {
  id: number;
  question: string;
  answer: string;
  isOpen: boolean;
}


@Component({
  selector: 'app-preguntas-screen',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './preguntas-screen.component.html',
  styleUrls: ['./preguntas-screen.component.scss']
})

export class PreguntasScreenComponent {
  faqs: FaqItem[] = [
    {
      id: 1,
      question: '¿Con cuánta anticipación puedo realizar una reserva?',
      answer: 'Las reservas pueden realizarse desde con 7 días de anticipación hasta 15 minutos antes del horario requerido, sujeto a disponibilidad en tiempo real.',
      isOpen: true
    },
    {
      id: 2,
      question: '¿Qué ocurre si no me presento a tiempo a mi espacio reservado?',
      answer: 'Existe un periodo de tolerancia de 15 minutos. Si no confirmas tu asistencia dentro de ese tiempo, el sistema liberará automáticamente la sala.',
      isOpen: false
    },
    {
      id: 3,
      question: '¿Puedo reservar un espacio para uso individual?',
      answer: 'Sí, contamos con cubículos de estudio individual y espacios adaptados a diferentes aforos, desde 1 persona hasta aulas grupales de 32 plazas.',
      isOpen: false
    },
    {
      id: 4,
      question: '¿Cómo puedo cancelar o modificar una reserva existente?',
      answer: 'Puedes gestionar todas tus reservas desde el módulo "Mis Reservas" tras iniciar sesión con tu cuenta institucional.',
      isOpen: false
    },
    {
      id: 5,
      question: '¿Qué requisitos necesito para acceder a las salas?',
      answer: 'Es indispensable contar con tu credencial institucional activa y presentar tu código de confirmación digital al ingresar.',
      isOpen: false
    }
  ];

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
