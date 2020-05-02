//
//  FirstViewController.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 4/19/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit
import SDWebImage
import CoreLocation

class HomeViewController: UITableViewController, CLLocationManagerDelegate {
    
    @IBOutlet weak var scrollView: UIScrollView!
    let weatherView = WeatherView(frame: CGRect(x: 0, y: 0, width: 414, height: 120))
    
    var articles: [Article] = []
    let worker: NewsHomeWorker = NewsHomeWorker()
    let weatherWorker: WeatherHomeWorker = WeatherHomeWorker()
    let searchController = UISearchController(searchResultsController: nil)
    
    func locationManager(_ manager: CLLocationManager,  didUpdateLocations locations: [CLLocation]) {
        let lastLocation = locations.last!
                   
        print(lastLocation)
    }

    @IBOutlet weak var newsTableView: IntrinsicTableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        navigationController?.navigationBar.prefersLargeTitles = true
        refreshControl = UIRefreshControl()
        navigationItem.searchController = searchController
        navigationItem.hidesSearchBarWhenScrolling = true
        
        self.tableView.tableHeaderView = weatherView
        
        weatherWorker.fetchWeatherHomeInformation(weatherCompletion: {(completion) in
            switch completion {
            case .success(let weather):
                self.weatherView.tempLabel.text = "\(weather.temp) ºC"
                self.weatherView.summaryLabel.text = weather.summary
                print("sucess")
            case .failure(let error):
                let alertController = UIAlertController(title: "Network Error", message:
                    error.localizedDescription, preferredStyle: .alert)
                alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
                self.present(alertController, animated: true, completion: nil)
            }
        })
        
        worker.fetchNewsHomeInformation(articlesCompletion: {(completion) in
            switch completion {
            case .success(let articles):
                self.articles = articles
                self.tableView.reloadData()
            case .failure(let error):
                let alertController = UIAlertController(title: "Network Error", message:
                    error.localizedDescription, preferredStyle: .alert)
                alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
                self.present(alertController, animated: true, completion: nil)
            }
        })
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // show all rows depending on how many videos we receive
        return articles.count
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        // customize and show data based on array
        let customCell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath) as? NewsTableViewCell
        
        customCell?.titleLabel.text = articles[indexPath.row].title
        customCell?.timeAgoLabel.text = articles[indexPath.row].date
        customCell?.sectionLabel.text = articles[indexPath.row].section
        guard let imageUrl = URL(string: articles[indexPath.row].image) else {
            let alertController = UIAlertController(title: "Image download Error", message:
                "Error downloading image with url: " + articles[indexPath.row].image, preferredStyle: .alert)
            alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
            return customCell!
        }
        customCell?.articleImageView?.sd_setImage(with: imageUrl, completed: nil)
        
        return customCell!
    }
}

