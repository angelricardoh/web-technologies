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
    private var resultsController: ResultsTableController!
    
    func locationManager(_ manager: CLLocationManager,  didUpdateLocations locations: [CLLocation]) {
        let lastLocation = locations.last!
                   
        print(lastLocation)
    }

    @IBOutlet weak var newsTableView: IntrinsicTableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        refreshControl = UIRefreshControl()
        refreshControl?.addTarget(self, action: #selector(refreshNewsHomeData), for: .valueChanged)
        
        resultsController =
        self.storyboard?.instantiateViewController(withIdentifier: "ResultsTableController") as? ResultsTableController

        let searchController = UISearchController(searchResultsController: resultsController)
        navigationItem.searchController = searchController
        navigationItem.hidesSearchBarWhenScrolling = true
        searchController.searchResultsUpdater = self
        
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
    }
    
    @objc func refreshNewsHomeData() {
        worker.fetchNewsHomeInformation(articlesCompletion: {(completion) in
            switch completion {
            case .success(let articles):
                self.articles = articles
                self.tableView.reloadData()
                self.refreshControl?.endRefreshing()
            case .failure(let error):
                let alertController = UIAlertController(title: "Network Error", message:
                    error.localizedDescription, preferredStyle: .alert)
                alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
                self.present(alertController, animated: true, completion: nil)
                self.refreshControl?.endRefreshing()
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
        customCell?.sectionLabel.text = "| " + articles[indexPath.row].section
        guard let imageUrl = URL(string: articles[indexPath.row].image) else {
            let alertController = UIAlertController(title: "Image download Error", message:
                "Error downloading image with url: " + articles[indexPath.row].image, preferredStyle: .alert)
            alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
            return customCell!
        }
//        customCell?.articleImageView?.sd_setImage(with: imageUrl, placeholderImage: UIImage(named: "default_guardian"))
        customCell?.articleImageView?.sd_setImage(with: imageUrl, completed: nil)
        
        return customCell!
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if let detailViewController = segue.destination as? DetailViewController {
            guard let indexPath = self.tableView.indexPathForSelectedRow else {
                return
            }
            let articleSelected = articles[indexPath.row]
            detailViewController.articleId = articleSelected.id
        }
    }
}

    extension HomeViewController: UISearchResultsUpdating {
      func updateSearchResults(for searchController: UISearchController) {
        print("updateSearchResults(for searchController: UISearchController)")
        
        let searchBar = searchController.searchBar
        if let searchText = searchBar.text, !searchText.isEmpty {
            print(searchText)
            let autosuggestWorker = BingAutosuggestWorker()
            autosuggestWorker.fetchAutoSuggestInformation(inputValue: searchText, autosuggestCompletion: {(completion) in
                switch completion {
                case .success(let suggestions):
                    self.resultsController.suggestions = suggestions
                    self.resultsController.tableView.reloadData()
                    print(suggestions)
                case .failure(let error):
                    print("Network Error: " + error.localizedDescription)
                }
            })
        }
        
//        let category = Candy.Category(rawValue:
//          searchBar.scopeButtonTitles![searchBar.selectedScopeButtonIndex])
//        filterContentForSearchText(searchBar.text!, category: category)
      }
    }

    extension HomeViewController: UISearchBarDelegate {
      func searchBar(_ searchBar: UISearchBar, selectedScopeButtonIndexDidChange selectedScope: Int) {
        print("searchBar(_ searchBar: UISearchBar, selectedScopeButtonIndexDidChange selectedScope")
        print(searchBar.scopeButtonTitles![selectedScope])
        print(searchBar.text!)
//        let category = Candy.Category(rawValue:
//          searchBar.scopeButtonTitles![selectedScope])
//        filterContentForSearchText(searchBar.text!, category: category)
      }
    }
