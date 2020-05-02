//
//  Article.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 4/26/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import Foundation
import SwiftyJSON

protocol JSONable {
    init?(parameter: JSON)
}

public struct Article: JSONable {
    var id: String
    var index: Int
    var title: String
    var image: String
    var section: String
    var date: String
    var description: String
    var shareUrl: String
    
    init?(parameter: JSON) {
        id = parameter["id"].stringValue
        index = parameter["index"].intValue
        title = parameter["title"].stringValue
        image = parameter["image"].stringValue
        section = parameter["section"].stringValue
        date = parameter["date"].stringValue
        description = parameter["description"].stringValue
        shareUrl = parameter["shareUrl"].stringValue
    }
}
