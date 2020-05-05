//
//  SecondViewController.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 4/19/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit
import XLPagerTabStrip

class HeadlinesViewController: ButtonBarPagerTabStripViewController {

    var resultsTableController: ResultsTableViewController?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        
        // change selected bar color
        settings.style.buttonBarBackgroundColor = .white
        settings.style.buttonBarItemBackgroundColor = .white
        settings.style.selectedBarBackgroundColor = .systemBlue
        settings.style.buttonBarItemFont = .boldSystemFont(ofSize: 20)
        settings.style.selectedBarHeight = 2.0
        settings.style.buttonBarMinimumLineSpacing = 0
        settings.style.buttonBarItemTitleColor = .systemBlue
        settings.style.buttonBarLeftContentInset = 0
        settings.style.buttonBarRightContentInset = 0
        
        changeCurrentIndexProgressive = { [weak self] (oldCell: ButtonBarViewCell?, newCell: ButtonBarViewCell?, progressPercentage: CGFloat, changeCurrentIndex: Bool, animated: Bool) -> Void in
            guard changeCurrentIndex == true else { return }
            oldCell?.label.textColor = .systemGray
            newCell?.label.textColor = .systemBlue
        }
        
        resultsTableController =
            self.storyboard?.instantiateViewController(withIdentifier: "ResultsTableController") as? ResultsTableViewController
            // This view controller is interested in table view row selections.
            resultsTableController?.tableView.delegate = self
        
        let searchController = UISearchController(searchResultsController: self.resultsTableController)
        navigationItem.searchController = searchController
        searchController.searchResultsUpdater = self
    }
    
    override func viewControllers(for pagerTabStripController: PagerTabStripViewController) -> [UIViewController] {
        let worldViewController = SectionTableViewController(sectionInfo: "WORLD")
        worldViewController.section = "world"
        let businessViewController = SectionTableViewController(sectionInfo: "BUSINESS")
        businessViewController.section = "business"
        let politicsViewController = SectionTableViewController(sectionInfo: "POLITICS")
        politicsViewController.section = "politics"
        let sportsViewController = SectionTableViewController(sectionInfo: "SPORTS")
        sportsViewController.section = "sport"
        let technologyViewController = SectionTableViewController(sectionInfo: "TECHNOLOGY")
        technologyViewController.section = "technology"
        let scienceViewController = SectionTableViewController(sectionInfo: "SCIENCE")
        scienceViewController.section = "science"
        
        let childViewControllers = [worldViewController,
                                    businessViewController,
                                    politicsViewController,
                                    sportsViewController,
                                    technologyViewController,
                                    scienceViewController]
        
        return childViewControllers
    }
}

extension HeadlinesViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        // Check to see which table view cell was selected.
        guard let query = resultsTableController?.suggestions[indexPath.row] else {
            print("resultsTableController suggestions does not exists in this controller")
            return
        }
        
        // Set up the detail view controller to push.
        let searchResultsViewController = SearchResultsViewController.searchResultsViewControllerForSearch(query)
        navigationController?.pushViewController(searchResultsViewController, animated: true)

        tableView.deselectRow(at: indexPath, animated: false)
    }
}

extension HeadlinesViewController: UISearchResultsUpdating {
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
                case .failure(let error):
                    print("Network Error: " + error.localizedDescription)
                }
            })
        }
    }
}

