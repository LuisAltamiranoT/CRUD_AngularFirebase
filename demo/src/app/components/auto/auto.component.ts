import { Component, OnInit } from '@angular/core';
import { ConsumorestService } from 'src/app/service/consumorest.service';
import { ConsumofirebaseService } from 'src/app/service/consumofirebase.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { from } from 'rxjs';


@Component({
  selector: 'app-auto',
  templateUrl: './auto.component.html',
  styleUrls: ['./auto.component.css']
})
export class AutoComponent implements OnInit {
  public autos: any = [];
  public documentId=null;

  public currentStatus=1;

  public newAutoForm = new FormGroup({
    marcaF: new FormControl('', Validators.required),
    modeloF: new FormControl('', Validators.required),
    anioF: new FormControl('', Validators.required),
    urlF: new FormControl('', Validators.required),
    idF: new FormControl('')
  });



  constructor(private fs: ConsumofirebaseService) { 
    this.newAutoForm.setValue({
      idF:'',
      marcaF:'',
      modeloF:'',
      anioF:'',
      urlF:'',
    });
    
  }

  ngOnInit() {
    this.obtenerAutos();
    
  }

  public nuevoAuto(form,documentId=this.documentId){
    if(this.currentStatus==1){
      let data={
        marca:form.marcaF,
        modelo:form.modeloF,
        anio:form.anioF,
        url:form.urlF
      }
      this.fs.crearAuto(data).then(()=>{
        console.log("Documento creado exitòsamente");
        this.newAutoForm.setValue({
          marcaF:'',
          modeloF:'',
          anioF:'',
          urlF:'',
          idF:''
        });
      },(error)=>{
        console.error(error);
      });
    }else{
      let data={
        marca:form.marcaF,
        modelo:form.modeloF,
        anio:form.anioF,
        url:form.urlF
      }
      this.fs.actualizarAuto(documentId,data).then(()=>{
        this.newAutoForm.setValue({
          marcaF:'',
          modeloF:'',
          anioF:'',
          urlF:'',
          idF:''
        });
        console.log('Documento editado exitosamente');
      },(error)=>{
        console.log(error);
      });
    }
  }
  

// crear un metodo para obtener todos los autos

  public obtenerAutos() {
    this.fs.ObtenerAutos().subscribe((dataDocumentos) => {
      dataDocumentos.forEach((data: any) => {
        this.autos.push({
          id: data.payload.doc.id,
          data: data.payload.doc.data()
        });
        console.log(this.autos);
      })
    });
  }

  public actualizarAuto(documentId){
    let editSubscribe=this.fs.obtenerAutoId(documentId).subscribe(
      (data)=>{
        this.currentStatus=2;
        this.documentId=documentId;
        this.newAutoForm.setValue({
          idF:documentId,
          marcaF:data.payload.data()['marca'],
          modeloF:data.payload.data()['modelo'],
          anioF:data.payload.data()['anio'],
          urlF:data.payload.data()['url'],
        })
        editSubscribe.unsubscribe();
      }
    );
  }


  //Eliminar
  public eliminarAuto(documentId){
    this.fs.eliminarAuto(documentId).then(()=>{
        console.log("Documento Eliminado");
      },(error)=>{
        console.log(error);
      })
  }

}


