//
//  NewsArticleWorker.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 4/26/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import Foundation

protocol NewsHomeWorkerInterface {
    func fetchNewsHomeInformation(articlesCompletion: @escaping ArticleResultHandler)
}

public enum ArticleResult {
    case success(articles: [Article])
    case failure(error: Error)
}

public typealias ArticleResultHandler = (_ result: ArticleResult) -> Void

struct NewsHomeWorker: NewsHomeWorkerInterface {
    
    private struct Constants {
        static let fetchNewsHomeURL = "guardian_news?section=home"
    }
    
    func fetchNewsHomeInformation(articlesCompletion: @escaping ArticleResultHandler) {
        let manager = NetworkManager()
        manager.loadInternalData(from: Constants.fetchNewsHomeURL, completionHandler: {(completion) in
            switch completion {
            case .success(let data):
                var articles: [Article] = []
                for article in data["articles"] {
                    guard let currentArticle = Article(parameter: article.1) else {
                        let error = JSONParseError(title: "JSON Parsing Error", description: "Error while parsing: " + article.1.stringValue, code: 0)
                        articlesCompletion(.failure(error: error))
                        return
                    }
                    articles.append(currentArticle)
                }
                articlesCompletion(.success(articles: articles))
                return
            case .failure(let error):
                print("%@", error)
                articlesCompletion(.failure(error: NetworkRequestError.unknown(nil)))
            }
        })
    }
}
