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
import SwiftSpinner

class HomeViewController: ArticleTableViewController {
        
    let locationManager = CLLocationManager()
    let worker: NewsWorker = NewsWorker()
    let weatherWorker: WeatherHomeWorker = WeatherHomeWorker()
    let weatherView = WeatherView(frame: CGRect(x: 0, y: 0, width: 414, height: 120))
    
    @IBOutlet weak var newsTableView: IntrinsicTableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        locationManager.delegate = self
        locationManager.requestWhenInUseAuthorization()
        // after showing the permission dialog, the program will continue executing the next line before the user has tap 'Allow' or 'Disallow'
        
        // if previously user has allowed the location permission, then request location
        if(CLLocationManager.authorizationStatus() == .authorizedWhenInUse || CLLocationManager.authorizationStatus() == .authorizedAlways){
            locationManager.requestLocation()
        }
                        
        refreshControl = UIRefreshControl()
        refreshControl?.addTarget(self, action: #selector(refreshNewsHomeData), for: .valueChanged)
        
        resultsTableController =
        self.storyboard?.instantiateViewController(withIdentifier: "ResultsTableController") as? ResultsTableViewController
        // This view controller is interested in table view row selections.
        resultsTableController?.tableView.delegate = self
        
        let searchController = UISearchController(searchResultsController: self.resultsTableController)
        navigationItem.searchController = searchController

        searchController.searchResultsUpdater = self

        SwiftSpinner.show("Loading Home Page..")
        
        tableView.tableHeaderView = weatherView
                
        // TODO: Uncomment this section for production
        
        refreshNewsHomeData()
    }
    
    func fetchWeather(for locality: String, state: String) {
        weatherWorker.fetchWeatherHomeInformation(locality: locality, weatherCompletion: {(completion) in
            switch completion {
            case .success(let weather):
                self.weatherView.tempLabel.text = "\(weather.temp) ºC"
                self.weatherView.summaryLabel.text = weather.summary
                self.weatherView.cityLabel.text = locality
                self.weatherView.stateLabel.text = state
                print(weather.image)
                self.weatherView.backgroundImageView?.image = UIImage(named: weather.image + ".jpg")
                case .failure(let error):
                let alertController = UIAlertController(title: "Network Error", message:
                    error.localizedDescription, preferredStyle: .alert)
                alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
                self.present(alertController, animated: true, completion: nil)
            }
        })
    }
    
    @objc func refreshNewsHomeData() {
        print("refreshNewsHomeData")
        worker.fetchNewsHomeInformation(articlesCompletion: {(completion) in
            SwiftSpinner.hide()
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
        if let searchText = searchBar.text, !searchText.isEmpty && searchText.count >= 3 {
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

extension HomeViewController: CLLocationManagerDelegate {
    // After user tap on 'Allow' or 'Disallow' on the dialog
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
      if(status == .authorizedWhenInUse || status == .authorizedAlways){
        manager.requestLocation()
      }
    }
    
    func locationManager(_ manager: CLLocationManager,  didUpdateLocations locations: [CLLocation]) {
        if let lastLocation = locations.last {
            let geocoder = CLGeocoder()
            var locality = "Los Angeles"
            var state = "California"
            
            // Look up the location and pass it to the completion handler
            geocoder.reverseGeocodeLocation(lastLocation,
                        completionHandler: { (placemarks, error) in
                if error == nil {
                    let firstLocation = placemarks?[0]
                    locality = firstLocation?.locality ?? "Los Angeles"
                    let stateCode = firstLocation?.administrativeArea ?? "California"
                    state = Utils.longStateName(stateCode)
                    self.fetchWeather(for: locality, state: state)
                } else {
                    self.fetchWeather(for: locality, state: state)
                }
            })
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        let alertController = UIAlertController(title: "Geolocation Error", message:
                            error.localizedDescription, preferredStyle: .alert)
                        alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
                        self.present(alertController, animated: true, completion: nil)
    }

}
