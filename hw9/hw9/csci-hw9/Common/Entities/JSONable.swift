//
//  JSONable.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/4/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import Foundation
import SwiftyJSON

protocol JSONable {
    init?(parameter: JSON)
}
