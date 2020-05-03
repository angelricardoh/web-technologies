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

class HomeViewController: ArticleTableViewController, CLLocationManagerDelegate {
    
    @IBOutlet weak var scrollView: UIScrollView!
    let weatherView = WeatherView(frame: CGRect(x: 0, y: 0, width: 414, height: 120))
    
    let worker: NewsHomeWorker = NewsHomeWorker()
    let weatherWorker: WeatherHomeWorker = WeatherHomeWorker()
    
    func locationManager(_ manager: CLLocationManager,  didUpdateLocations locations: [CLLocation]) {
        let lastLocation = locations.last!
                   
        print(lastLocation)
    }

    @IBOutlet weak var newsTableView: IntrinsicTableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        refreshControl = UIRefreshControl()
        refreshControl?.addTarget(self, action: #selector(refreshNewsHomeData), for: .valueChanged)
        
        resultsTableController =
        self.storyboard?.instantiateViewController(withIdentifier: "ResultsTableController") as? ResultsTableViewController
        // This view controller is interested in table view row selections.
        resultsTableController?.tableView.delegate = self

        let searchController = UISearchController(searchResultsController: self.resultsTableController)
        navigationItem.searchController = searchController
        searchController.searchResultsUpdater = self
        
        let nib = UINib(nibName: "NewsTableViewCell", bundle: nil)
        tableView.register(nib, forCellReuseIdentifier: "newsCell")
        self.tableView.tableHeaderView = weatherView
        
        // TODO: Uncomment this section for production
//        weatherWorker.fetchWeatherHomeInformation(weatherCompletion: {(completion) in
//            switch completion {
//            case .success(let weather):
//                self.weatherView.tempLabel.text = "\(weather.temp) ºC"
//                self.weatherView.summaryLabel.text = weather.summary
//                print(weather.image)
//                self.weatherView.backgroundImageView?.image = UIImage(named: weather.image + ".jpg")
//                case .failure(let error):
//                let alertController = UIAlertController(title: "Network Error", message:
//                    error.localizedDescription, preferredStyle: .alert)
//                alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
//                self.present(alertController, animated: true, completion: nil)
//            }
//        })
        
        refreshNewsHomeData()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true);
        navigationController?.navigationBar.prefersLargeTitles = true
        navigationItem.hidesSearchBarWhenScrolling = true
    }
    
    @objc func refreshNewsHomeData() {
        worker.fetchNewsHomeInformation(articlesCompletion: {(completion) in
            self.refreshControl?.endRefreshing()
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
}

extension HomeViewController: UISearchResultsUpdating {
    func updateSearchResults(for searchController: UISearchController) {
        print("updateSearchResults(for searchController: UISearchController)")
        
        let searchBar = searchController.searchBar
        if let searchText = searchBar.text, !searchText.isEmpty && searchText.count > 3 {
            print(searchText)
            let autosuggestWorker = BingAutosuggestWorker()
            autosuggestWorker.fetchAutoSuggestInformation(inputValue: searchText, autosuggestCompletion: {(completion) in
                switch completion {
                case .success(let suggestions):
                    self.resultsTableController?.suggestions = suggestions
                    self.resultsTableController?.tableView.reloadData()
                    print(suggestions)
                case .failure(let error):
                    print("Network Error: " + error.localizedDescription)
                }
            })
        }
    }
}
