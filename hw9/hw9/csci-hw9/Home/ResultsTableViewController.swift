//
//  ResultsTableViewController.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/3/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit

class ResultsTableController: UITableViewController {
    
    let tableViewCellIdentifier = "cellID"
    
    var suggestions = [String]()
    
    @IBOutlet weak var resultsLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        let nib = UINib(nibName: "TableCell", bundle: nil)
        tableView.register(nib, forCellReuseIdentifier: tableViewCellIdentifier)
    }
    
    // MARK: - UITableViewDataSource
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return suggestions.count
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: tableViewCellIdentifier, for: indexPath)
        let suggestion = suggestions[indexPath.row]
        
        cell.textLabel?.text = suggestion
                
        return cell
    }
}
