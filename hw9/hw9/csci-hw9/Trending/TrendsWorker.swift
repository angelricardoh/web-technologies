//
//  TrendsWorker.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/4/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import Foundation

protocol trendsWorkerInterface {
    func fetchTrends(query:String, trendsCompletion: @escaping trendsResultHandler)
}

public enum trendsResult {
    case success(trends: [Trend])
    case failure(error: Error)
}

public typealias trendsResultHandler = (_ result: trendsResult) -> Void

struct TrendsWorker: trendsWorkerInterface {
    
    private struct Constants {
        static let fetchTrendsStringURL = "trends?q="
    }
    
    func fetchTrends(query:String, trendsCompletion: @escaping trendsResultHandler) {
        let manager = NetworkManager()
        guard let encodedQuery = query.addingPercentEncoding(withAllowedCharacters:NSCharacterSet.urlQueryAllowed) else {
            trendsCompletion(.failure(error: NetworkRequestError.api(6, ApiResultCode.malformedRequest, "Error while encoding query for Trends")))
            return
        }
        let trendsUrl = Constants.fetchTrendsStringURL + encodedQuery
        manager.loadInternalData(from: trendsUrl, completionHandler: {(completion) in
            switch completion {
            case .success(let data):
                var trends: [Trend] = []
                for point in data.array! {
                    if let trend = Trend(parameter: point) {
                        trends.append(trend)
                    }
                }
                print(trends)
 
//                var articles: [Article] = []
//                for article in data["articles"] {
//                    guard let currentArticle = Article(parameter: article.1) else {
//                        let error = JSONParseError(title: "JSON Parsing Error", description: "Error while parsing: " + article.1.stringValue, code: 0)
//                        searchCompletion(.failure(error: error))
//                        return
//                    }
//                    articles.append(currentArticle)
//                }
                
                trendsCompletion(.success(trends: trends))
                return
            case .failure(let error):
                print("%@", error)
                trendsCompletion(.failure(error: NetworkRequestError.unknown(nil)))
            }
        })
    }
}
