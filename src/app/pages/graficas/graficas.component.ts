import { ModalController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

declare var google;

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.scss'],
})
export class GraficasComponent implements OnInit {

  constructor(public modalController: ModalController,
              public loadingController: LoadingController) {
                 }

  ngOnInit() {
    //this.showChart();
    this.showChart();
  }

  closeModal(){
    this.modalController.dismiss();
  }

  showChart(){
    // Create the data table.
    document.getElementById('chart_div').innerHTML = '';
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows([
      ['Cepillo', 25],
      ['yogurt fresa', 10],
      ['prueba', 5],
      ['Proteina', 6],
      ['Juguetes', 8]
    ]);

    // Set chart options
    var options = {'title':'Los 5 producutos mas vendidos',
                   'width':400,
                   'height':300};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }

   drawChart() {
    document.getElementById('chart_div').innerHTML = '';
    var data = google.visualization.arrayToDataTable([
      ['Año', 'Ventas', 'Gastos'],
      ['2021',  30,      1000],
      ['2022',  54,      1200],
    ]);

    var options = {
      title: 'Productos',
      curveType: 'function',
      legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

    chart.draw(data, options);
  }

  drawChartColum() {
    document.getElementById('chart_div').innerHTML = '';
    var data = google.visualization.arrayToDataTable([
      ["Elemento", "Densidad", { role: "style" } ],
      ["Cepillo", 25, "#b87333"],
      ["yogurt", 10, "silver"],
      ["prueba", 5, "gold"],
      ["Proteina", 6, "color: #e5e4e2"],
      ["Jugutes", 8, "#859614"],
    ]);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
                     { calc: "stringify",
                       sourceColumn: 1,
                       type: "string",
                       role: "annotation" },
                     2]);

    var options = {
      title: "Density of Precious Metals, in g/cm^3",
      width: 400,
      height: 200,
      bar: {groupWidth: "50%"},
      legend: { position: "none" },
    };
   
    var chart = new google.visualization.ColumnChart(document.getElementById("chart_div"));
    chart.draw(view, options);
  }


}
