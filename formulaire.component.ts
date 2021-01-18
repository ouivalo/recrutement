import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavigationFormulaireService } from '../services/navigation-formulaire.service';
import { ActivatedRoute, Router, RouterState } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { Observable, BehaviorSubject, Subscription, UnsubscriptionError } from 'rxjs';
import { RouterNavigation, RouterDataResolved } from '@ngxs/router-plugin';
import { FormulaireState, ChangerPage, InitType} from '../store/formulaire';
import { SetReponse, HerosState, SetId } from '../store/heros';
import { VerificationChampsService } from '../services/verification-champs.service';
import { PaiementService } from '../services/paiement.service';
import { ChargerInfosRelais } from '../store/relais';
import { EnvoiDonneesService } from '../services/envoi-donnees.service';
import { ChangerNumPagePaiement } from '../store/paiement';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.scss']
})
export class FormulaireComponent implements OnInit {


  ...

  majVerifChamps(){
    //Vérifie le remplissage des champs actuels
    //si ok, passe verifChamp à true
    //sinon, false
    
    
    for(let i = 0; i < this.questions.length; i++){
      //console.log("majVerifChamps pour la réponse : "+this.reponse[i]);
      if( (this.reponse[i] !== undefined)&&(this.reponse[i] !== '')){
        //console.log("passe le test");
        let min = 0;
        let max=0;
        let required=false;
        if(this.questions[i]["type-reponse"]===6){
          min = this.questions[i]["min"];
          if(this.questions[i]["max"]!==undefined){
            max = this.questions[i]["max"];
          }
        }
        if(this.questions[i]["type-reponse"]===5){
          if(this.questions[i]["required"]===true){
            required=true;
          }
        }
        this.verifChamp[i]=this.verifChampsService.verifChamp(this.questions[i]["type-reponse"], this.reponse[i], min, max, required);
        //console.log("Vérification du champ "+this.questions[i]["nom"]+" : "+this.verifChamp[i]);
      }else{
        //console.log("ne passe pas le test");
        this.verifChamp[i]=0;
        //console.log("Vérification du champ non trouvée "+this.questions[i]["nom"]+" : "+this.verifChamp[i]);
      }
    }
  }

  

  onChange(event: any, id:number=0, nom:string=''){
    //Vérification des inputs
    //console.log(this.verifChamp);
    //console.log("Onchange event : "+event+" pour l'id : "+id);

    let value=event;

    if(this.questions[id]['type-reponse']===6){
      value=this.verifChampsService.arrondi(value,this.questions[id]['step']);
    }else if(this.questions[id]['type-reponse']===2){ //Textarea enlever les line breaks
      value = value.replace(/(\r\n|\n|\r)/gm,"");
    }else if(this.questions[id]['type-reponse']===7){ //Telephone : forcer le 0
      if(value!=0){
        value="0"+value;
      }
    }
    
    else if(this.modeAffichage==='paiement'){

      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    }
    //console.log("Réponse : "+value);
    this.store.dispatch(new SetReponse(this.questions[id]['nom'],value)).subscribe(
      () => this.majVerifChamps()
    );

  }

  ...
}