import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VerificationChampsService {

  //Description des états de vérification :
  // 0 : initial, 1 : erronné, 2 : valeur valide

  constructor() { }

  public static dateFormat(date: Date): String{
    let elements = [""+date.getDate(),""+(date.getMonth()+1),""+date.getHours(),""+date.getMinutes(),""+date.getSeconds()];
    for(let i = 0; i < elements.length;i++){
      if((""+elements[i]).length<=1){
        elements[i]="0"+elements[i];
      }
    }
    var str=elements[0]+"/"+elements[1]+"/"+date.getFullYear()+" "+elements[2]+":"+elements[3]+":"+elements[4];
    //console.log(str);
    return str;

  }

  public arrondi(montant: number, step){
    montant = montant / step;
    montant = Math.round(montant);
    return montant * step;
  }

  public verifChamp(type: number, value:any, min:number=0, max: number=0, required: boolean = false): number{

    let result = 0;
    //console.log("Service de vérification pour le type "+type);

    if(type===0){ // Page d'affichage
      result=2;
    }else if(type===1){
      //TExte Court
      result=this.texteCourt(value);
    }else if(type===2){
      //Texte Long
      result=this.texteLong(value);
    }else if (type===4){
      //Choix multiples
      if(value!=-1){
        result = 2; // toujours ok
      }else{
        result=0;
      }
    }
    else if(type===5){ //checkbox
      if(required){
        if(value){
          result=2;
        }else{
          result=1;
        }
      }else{
        result=2;
      }
    }
    else if(type ===6){ // nombre
      if(value>=min){ //superieur au minimum
        if((max!==0)&&(value>max)){
          result = 1;
        }else{
          result= 2;
        }
      }else{
        result= 1;
      }
    }else if(type===7){ //tel
      result=2;
    }else if(type===8){ // mail
      result=this.mail(value);
    }
    //console.log("résultat : "+result);
    return result;
  }

  private texteCourt(value: string): number{

    //Vérification du prénom
    let str:string = value;
    //console.log("str à tester :");

    if(str.length>=2){
      //Entre 2 et 30 caractères alphabétiques
      const regex1 = /^[\w'\-ç,.][^0-9_!¡?÷?¿/\\+=@#$%&*(){}|~<>;:[\]]{1,30}$/;

      let array1= regex1.exec(str);
      if(array1 !== null){
        //on a trouvé une correspondance, c'est good
        return 2;
      }else{
        // pas de match, c'est pas good
        return 1;
      }
    }else{
      return 0;
    }
  }

  private texteLong(value: string): number{

    //Vérification du prénom
    let str:string = value;

    if(str.length>=3){
      //Entre 10 et 1000 caractères alphabétiques

      return 2;
    }else{
      return 0;
    }
  }

  private mail(value: string): number{
    //Vérification du prénom
    let str:string = value;
    //console.log("str à tester :");

    if(str.length>=2){
      const regex =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let array1= regex.exec(str);
      if(array1 !== null){
        //on a trouvé une correspondance, c'est good
        return 2;
      }else{
        // pas de match, c'est pas good
        return 1;
      }
    }else{
      return 0;
    }
  }
}
