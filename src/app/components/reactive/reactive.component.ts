import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidadoresService } from '../../services/validadores.service';

@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styles: [],
})
export class ReactiveComponent implements OnInit {
  forma!: FormGroup;

  constructor(private fb: FormBuilder, 
              private validadores: ValidadoresService) {
    this.crearFormulario();
    this.cargarDataAlFormulario();
    this.crearListeners();
  }

  ngOnInit(): void {}

  get pasatiempos(){
    return this.forma.get('pasatiempos') as FormArray;
  }

  get nombreNoValido() {
    return (
      this.forma.get('nombre')?.invalid && this.forma.get('nombre')?.touched
    );
  }

  get apellidoNoValido() {
    return (
      this.forma.get('apellido')?.invalid && this.forma.get('apellido')?.touched
    );
  }

  get correoNoValido() {
    return (
      this.forma.get('correo')?.invalid && this.forma.get('correo')?.touched
    );
  }

  get poblacionNoValida() {
    return (
      this.forma.get('direccion.poblacion')?.invalid &&
      this.forma.get('direccion.poblacion')?.touched
    );
  }

  get provinciaNoValida() {
    return (
      this.forma.get('direccion.provincia')?.invalid &&
      this.forma.get('direccion.provincia')?.touched
    );
  }

  get usuarioNoValido() {
    return this.forma.get('usuario').invalid && this.forma.get('usuario').touched
  
  }

  get pass1NoValido() {
    return this.forma.get('pass1').invalid && this.forma.get('pass1').touched
  
  }

  get pass2NoValido() {
    const pass1 = this.forma.get('pass1').value;
    const pass2 = this.forma.get('pass2').value;

    return ( pass1 === pass2 ) ? false : true;
  }

  crearFormulario() {
    this.forma = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      apellido: ['', [Validators.required, Validators.minLength(5), this.validadores.noSerrano]],
      pass1: ['', Validators.required],
      pass2: ['', Validators.required],
      correo: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      usuario: ['', , this.validadores.existeUsuario],      
      direccion: this.fb.group({
        poblacion: ['', Validators.required],
        provincia: ['', Validators.required],
      }),
      pasatiempos: this.fb.array([])
    },{
      validators: this.validadores.passwordsIguales('pass1', 'pass2')
    });
  }

  crearListeners(){
    this.forma.valueChanges.subscribe( valor =>{
      console.log(valor);
    });

    this.forma.statusChanges.subscribe(status => console.log({status}))
  }

  cargarDataAlFormulario(){
  //  this.forma.setValue({
    this.forma.reset({
      nombre: 'Txema',
      apellido: 'Serrano',
      correo: 'jsersan@gmail.com',
      pass1: '123',
      pass2: '123',
      direccion: {
        poblacion: 'Arrasate',
        provincia: 'Gipuzkoa'
      }
    });
  }

  agregarPasatiempo(){
    this.pasatiempos.push(this.fb.control(''))
  }

  borrarPasatiempo(i: number){
    this.pasatiempos.removeAt(i)
  }


  guardar() {
    console.log(this.forma);

    if (this.forma.invalid) {
      return Object.values(this.forma.controls).forEach((control) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((control) =>
            control.markAsTouched()
          );
        } else {
          control.markAsTouched();
        }
      });
    }

    // Posteo de la información
    this.forma.reset();
  }
}
