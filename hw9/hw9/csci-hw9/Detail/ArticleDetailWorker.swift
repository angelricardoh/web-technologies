//
//  ArticleDetailWorker.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/2/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import Foundation

protocol ArticleDetailWorkerInterface {
    func fetchArticleDetailInformation(articleId:String, articleCompletion: @escaping ArticleDetailResultHandler)
}

public enum ArticleDetailResult {
    case success(article: Article)
    case failure(error: Error)
}

public typealias ArticleDetailResultHandler = (_ result: ArticleDetailResult) -> Void

struct ArticleDetailWorker: ArticleDetailWorkerInterface {
    
    private struct Constants {
        static let fetchArticleDetailURL = "article_detail?&articleId="
    }
    
    func fetchArticleDetailInformation(articleId:String, articleCompletion: @escaping ArticleDetailResultHandler) {
        let manager = NetworkManager()
        let articleDetailUrl = Constants.fetchArticleDetailURL + articleId
        manager.loadInternalData(from: articleDetailUrl, completionHandler: {(completion) in
            switch completion {
            case .success(let data):
                guard var article: Article = Article(parameter: data["detail"]) else {
                    let error = JSONParseError(title: "JSON Parsing Error", description: "Error while parsing: " + data.stringValue, code: 0)
                                           articleCompletion(.failure(error: error))
                                           return
                }
                article.id = articleId
                articleCompletion(.success(article: article))
                return
            case .failure(let error):
                print("%@", error)
                articleCompletion(.failure(error: NetworkRequestError.unknown(nil)))
            }
        })
    }
}
