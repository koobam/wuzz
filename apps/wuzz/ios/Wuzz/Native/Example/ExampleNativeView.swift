import UIKit
import React

/// Example native component that demonstrates how to create a native UIView
/// and bridge it to React Native
final class ExampleNativeView: UIView {
  
  // MARK: - Views
  
  private let containerView = UIView()
  private let titleLabel = UILabel()
  private let subtitleLabel = UILabel()
  private let actionButton = UIButton(type: .system)
  
  // MARK: - Properties
  
  @objc var onButtonPress: RCTBubblingEventBlock?
  
  // React Native props - these will be set automatically by React Native
  @objc var title: String = "Native Component" {
    didSet {
      DispatchQueue.main.async { [weak self] in
        self?.titleLabel.text = self?.title
      }
    }
  }
  
  @objc var subtitle: String = "This is a native iOS view" {
    didSet {
      DispatchQueue.main.async { [weak self] in
        self?.subtitleLabel.text = self?.subtitle
      }
    }
  }
  
  @objc var buttonText: String = "Tap Me" {
    didSet {
      DispatchQueue.main.async { [weak self] in
        self?.actionButton.setTitle(self?.buttonText, for: .normal)
      }
    }
  }
  
  @objc var buttonColor: UIColor = .systemBlue {
    didSet {
      DispatchQueue.main.async { [weak self] in
        self?.actionButton.backgroundColor = self?.buttonColor
      }
    }
  }
  
  // MARK: - Init
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    setup()
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  // MARK: - Setup
  
  private func setup() {
    backgroundColor = .systemBackground
    
    // Container
    containerView.backgroundColor = UIColor.systemBlue.withAlphaComponent(0.1)
    containerView.layer.cornerRadius = 12
    addSubview(containerView)
    
    // Title Label
    titleLabel.text = title
    titleLabel.font = .boldSystemFont(ofSize: 24)
    titleLabel.textAlignment = .center
    titleLabel.textColor = .label
    containerView.addSubview(titleLabel)
    
    // Subtitle Label
    subtitleLabel.text = subtitle
    subtitleLabel.font = .systemFont(ofSize: 16)
    subtitleLabel.textAlignment = .center
    subtitleLabel.textColor = .secondaryLabel
    containerView.addSubview(subtitleLabel)
    
    // Action Button
    actionButton.setTitle(buttonText, for: .normal)
    actionButton.titleLabel?.font = .boldSystemFont(ofSize: 16)
    actionButton.backgroundColor = buttonColor
    actionButton.setTitleColor(.white, for: .normal)
    actionButton.layer.cornerRadius = 8
    actionButton.addTarget(self, action: #selector(handleButtonTap), for: .touchUpInside)
    containerView.addSubview(actionButton)
  }
  
  // MARK: - Layout
  
  override func layoutSubviews() {
    super.layoutSubviews()
    
    let width = bounds.width
    let padding: CGFloat = 20
    let containerWidth = width - (padding * 2)
    
    // Container
    containerView.frame = CGRect(
      x: padding,
      y: padding,
      width: containerWidth,
      height: bounds.height - (padding * 2)
    )
    
    // Title Label
    titleLabel.frame = CGRect(
      x: padding,
      y: 40,
      width: containerWidth - (padding * 2),
      height: 30
    )
    
    // Subtitle Label
    subtitleLabel.frame = CGRect(
      x: padding,
      y: titleLabel.frame.maxY + 8,
      width: containerWidth - (padding * 2),
      height: 20
    )
    
    // Action Button
    let buttonWidth: CGFloat = 150
    let buttonHeight: CGFloat = 44
    actionButton.frame = CGRect(
      x: (containerWidth - buttonWidth) / 2,
      y: containerView.bounds.height - buttonHeight - 40,
      width: buttonWidth,
      height: buttonHeight
    )
  }
  
  // MARK: - Actions
  
  @objc private func handleButtonTap() {
    // Send event to React Native
    onButtonPress?([
      "message": "Button tapped in native iOS!",
      "timestamp": Date().timeIntervalSince1970
    ])
  }
}

