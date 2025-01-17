//
//  SearchWorker.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/3/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import Foundation

protocol SearchWorkerInterface {
    func fetchSearch(query:String, searchCompletion: @escaping SearchResultHandler)
}

public enum SearchResult {
    case success(articles: [Article])
    case failure(error: Error)
}

public typealias SearchResultHandler = (_ result: SearchResult) -> Void

struct SearchWorker: SearchWorkerInterface {
    
    private struct Constants {
        static let fetchSearchURL = "search?q="
    }
    
    func fetchSearch(query:String, searchCompletion: @escaping SearchResultHandler) {
        let manager = NetworkManager()
        guard let encodedQuery = query.addingPercentEncoding(withAllowedCharacters:NSCharacterSet.urlQueryAllowed) else {
            searchCompletion(.failure(error: NetworkRequestError.api(5, ApiResultCode.malformedRequest, "Error while encoding query for search")))
            return
        }
        let searchUrl = Constants.fetchSearchURL + encodedQuery
        manager.loadInternalData(from: searchUrl, completionHandler: {(completion) in
            switch completion {
            case .success(let data):
                var articles: [Article] = []
                for article in data["articles"] {
                    guard let currentArticle = Article(parameter: article.1) else {
                        let error = JSONParseError(title: "JSON Parsing Error", description: "Error while parsing: " + article.1.stringValue, code: 0)
                        searchCompletion(.failure(error: error))
                        return
                    }
                    articles.append(currentArticle)
                }
                searchCompletion(.success(articles: articles))
                return
            case .failure(let error):
                print("%@", error)
                searchCompletion(.failure(error: NetworkRequestError.unknown(nil)))
            }
        })
    }
}
