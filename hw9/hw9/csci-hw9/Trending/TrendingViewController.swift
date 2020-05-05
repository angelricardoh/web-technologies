//
//  TrendingViewController.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 4/19/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit
import Charts

class TrendingViewController: UIViewController, UITextFieldDelegate, ChartViewDelegate {
    
    let trendsWorker: TrendsWorker = TrendsWorker()
    @IBOutlet weak var chartView: LineChartView!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        navigationController?.navigationBar.prefersLargeTitles = true
                
        chartView.delegate = self
        
        chartView.chartDescription?.enabled = false
        chartView.dragEnabled = true
        chartView.setScaleEnabled(true)
        chartView.pinchZoomEnabled = true
        
        let leftAxis = chartView.leftAxis
        leftAxis.removeAllLimitLines()
        leftAxis.axisMaximum = 110
        leftAxis.axisMinimum = -10
        leftAxis.drawLimitLinesBehindDataEnabled = true
        
        chartView.rightAxis.enabled = false
        chartView.legend.form = .line
        
        self.fetchChartData()
    }
    
    func fetchChartData(query: String = "Coronavirus") {
        trendsWorker.fetchTrends(query: query, trendsCompletion: {(completion) in
            switch completion {
            case .success(let trends):
                self.setDataChart(title:query, data: trends)
                print(trends)
            case .failure(let error):
                let alertController = UIAlertController(title: "Network Error", message:
                    error.localizedDescription, preferredStyle: .alert)
                alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
                self.present(alertController, animated: true, completion: nil)
            }
        })
    }
    
    func setDataChart(title: String, data: [Trend]) {
        let values = data.map {
            ChartDataEntry(x: Double($0.x),
                           y: Double($0.y))
        }
            
        let linearSet = LineChartDataSet(entries: values, label: "Trending Chart for " + title)
        linearSet.setColor(.systemBlue)
        linearSet.setCircleColor(.systemBlue)
        linearSet.lineWidth = 1
        linearSet.circleRadius = 3
        linearSet.drawCircleHoleEnabled = false
        
        let data = LineChartData(dataSet: linearSet)
        
        chartView.data = data
    }

    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        guard let query = textField.text else {
            let alertController = UIAlertController(title: "Logical Error", message:
                 "query text from Search Text Field could not be retrieved", preferredStyle: .alert)
             alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
             self.present(alertController, animated: true, completion: nil)
            return true
        }
        
        self.fetchChartData(query: query)
        return true
    }
}
