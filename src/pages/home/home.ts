import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import { LoadingController } from 'ionic-angular';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  detailToggle = [];
  objectKeys = Object.keys;
  coins: Object;
  details: Object;
  likedCoins = [];
  chart = [];
  raws = [];
  allcoinshome:[1];

  constructor(public navCtrl: NavController, private _data: DataProvider, private storage: Storage,public loading: LoadingController) {
    
  }

  
  ionViewWillEnter() {
    this.refreshCoins();
  }

  refreshCoins() {

    let loader = this.loading.create({
      content: 'Refreshing..',
      spinner: 'bubbles'
    });

    loader.present().then(() => {

      this.storage.get('likedCoins').then((val) => {

        // If the value is not set, then:
        if(!val) {
          this.likedCoins.push('BTC','ETH','EOS', 'LTC', 'XRP');
          this.storage.set('likedCoins', this.likedCoins);

          this._data.getCoins(this.likedCoins)
            .subscribe(res => {
              this.coins = res;
              loader.dismiss();
            })
        }
        // It's set
        else {
          this.likedCoins = val;

          this._data.getCoins(this.likedCoins)
          .subscribe(res => {
            this.coins = res;
            loader.dismiss();
          })


          this._data.allCoinsimages(this.likedCoins)
        .subscribe(res => {
          
          this.allcoinshome = res['Data'];
        
          
       
         

        })


        }

      });

    });

  }

  coinDetails(coin,index) {

    if (this.detailToggle[index])
      this.detailToggle[index] = false;
    else {
      this.detailToggle.fill(false);
      this._data.getCoin(coin)
        .subscribe(res => {
          this.details = res['DISPLAY'][coin]['USD'];
          console.log(coin);
          this.detailToggle[index] = true;    
          
          this._data.getChart(coin)
          .subscribe(res => {
  
            console.log(res);
            
            let coinHistory = res['Data'].map((a) => (a.close));
            
        
           // fillcolor: "#f56700",
            //backgroundColor:  "#f56700",

          
            setTimeout(()=> {
              this.chart[index] = new Chart('canvas'+index, {
                type: 'line',
                data: {
                  labels: coinHistory,
                  datasets: [{ 
                      data: coinHistory,
                     borderColor: "#ff3d00",
                     backgroundColor:  "#f56700",
                      fillcolor: "#ff9800",
                     
                    }
                  ]
                },
              
                options: {
                  tooltips: {
                    callbacks: {
                        label: function(tooltipItems, data) {
                            return "$" + tooltipItems.yLabel.toString();
                        }
                      }
                    },
                    responsive: true, 
                    legend: {
                      display: false
                  },
                  scales: {
                    xAxes: [{
                      display: false
                    }],
                    yAxes: [{
                      display: false
                    }],
                  }
                }
              });
            }, 250);
          
            
          });


        });


      }

  }

  swiped(index) {
    this.detailToggle[index] = false;
  }

  removeCoin(coin) {
    this.detailToggle.fill(false);

    this.likedCoins = this.likedCoins.filter(function(item) {
      return item !== coin
    });

    this.storage.set('likedCoins', this.likedCoins);

    setTimeout(() => {
      this.refreshCoins();
    }, 300);
  }

  showSearch() {
    this.navCtrl.push(SearchPage);
  }



  ionViewDidLoad() {
    

    

     
    
  }




}
