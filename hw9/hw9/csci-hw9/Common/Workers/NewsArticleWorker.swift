//
//  NewsArticleWorker.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 4/26/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import Foundation

protocol NewsWorkerInterface {
    func fetchNewsHomeInformation(articlesCompletion: @escaping ArticleResultHandler)
    func fetchNewsSectionInformation(section: String, articlesCompletion: @escaping ArticleResultHandler)
}

public enum ArticleResult {
    case success(articles: [Article])
    case failure(error: Error)
}

public typealias ArticleResultHandler = (_ result: ArticleResult) -> Void

struct NewsWorker: NewsWorkerInterface {
    
    private struct Constants {
        static let fetchNewsHomeURL = "guardian_news"
    }
    
    func fetchNewsHomeInformation(articlesCompletion: @escaping ArticleResultHandler) {
        fetchNewsInformation(urlString: Constants.fetchNewsHomeURL, articlesCompletion: articlesCompletion)
    }
    
    func fetchNewsSectionInformation(section: String, articlesCompletion: @escaping ArticleResultHandler) {
        fetchNewsInformation(urlString: Constants.fetchNewsHomeURL + "?section=" + section, articlesCompletion: articlesCompletion)
    }
    
    private func fetchNewsInformation(urlString: String, articlesCompletion: @escaping ArticleResultHandler) {
        let manager = NetworkManager()
        manager.loadInternalData(from: urlString, completionHandler: {(completion) in
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
