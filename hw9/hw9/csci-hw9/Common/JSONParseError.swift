//
//  JSONParsingError.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/1/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import Foundation

protocol JSONParsingError: LocalizedError {
    var title: String? { get }
    var code: Int { get }
}

struct JSONParseError: JSONParsingError {

    var title: String?
    var code: Int
    var errorDescription: String? { return _description }
    var failureReason: String? { return _description }

    private var _description: String

    init(title: String?, description: String, code: Int) {
        self.title = title ?? "Error"
        self._description = description
        self.code = code
    }
}
