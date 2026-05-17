import UIKit
import NitroModules

// MARK: - The actual UIView (CAGradientLayer + CABasicAnimation)
// CABasicAnimation runs on the GPU compositor thread — zero CPU per frame.

final class ShimmerUIView: UIView {

  private let shimmerLayer = CAGradientLayer()
  private let shimmerWidth: CGFloat = 160

  var duration: Double = 1800 { didSet { restartAnimation() } }

  var cornerRadius: Double = 0 {
    didSet {
      layer.cornerRadius  = CGFloat(cornerRadius)
      layer.masksToBounds = true
    }
  }

  var shimmerColor: String = "#E0E0E0" {
    didSet { backgroundColor = UIColor(hex: shimmerColor) ?? backgroundColor }
  }

  var highlightOpacity: Double = 0.7 { didSet { updateGradientColors() } }

  override init(frame: CGRect) {
    super.init(frame: frame)
    setup()
  }

  @available(*, unavailable)
  required init?(coder: NSCoder) { fatalError() }

  private func setup() {
    backgroundColor     = UIColor(white: 0.878, alpha: 1)
    clipsToBounds       = true
    shimmerLayer.startPoint = CGPoint(x: 0, y: 0.5)
    shimmerLayer.endPoint   = CGPoint(x: 1, y: 0.5)
    shimmerLayer.locations  = [0, 0.2, 0.5, 0.8, 1.0]
    updateGradientColors()
    layer.addSublayer(shimmerLayer)
  }

  private func updateGradientColors() {
    let op = CGFloat(highlightOpacity)
    shimmerLayer.colors = [
      UIColor.white.withAlphaComponent(0.0).cgColor,
      UIColor.white.withAlphaComponent(op * 0.4).cgColor,
      UIColor.white.withAlphaComponent(op).cgColor,
      UIColor.white.withAlphaComponent(op * 0.4).cgColor,
      UIColor.white.withAlphaComponent(0.0).cgColor,
    ]
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    CATransaction.begin()
    CATransaction.setDisableActions(true)
    shimmerLayer.frame = CGRect(x: 0, y: 0, width: shimmerWidth, height: bounds.height)
    CATransaction.commit()
    restartAnimation()
  }

  private func restartAnimation() {
    guard bounds.width > 0 else { return }
    shimmerLayer.removeAllAnimations()

    let anim                    = CABasicAnimation(keyPath: "position.x")
    anim.fromValue              = -(shimmerWidth / 2)
    anim.toValue                = bounds.width + shimmerWidth / 2
    anim.duration               = duration / 1_000.0
    anim.repeatCount            = .infinity
    anim.isRemovedOnCompletion  = false
    anim.timingFunction         = CAMediaTimingFunction(controlPoints: 0.4, 0, 0.2, 1)
    shimmerLayer.add(anim, forKey: "shimmer")
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()
    window != nil ? restartAnimation() : shimmerLayer.removeAllAnimations()
  }
}

// MARK: - Nitro HybridView
// Owns the UIView, bridges props from JS → UIView.
// beforeUpdate/afterUpdate/onDropView have default no-op impls from HybridView extension.

final class HybridShimmerView: HybridShimmerViewSpec_base, HybridShimmerViewSpec_protocol {

  // Nitro reads this to embed our UIView inside RCTViewComponentView
  let view = ShimmerUIView()

  // MARK: - Props (forwarded to the UIView)

  var duration: Double {
    get { view.duration }
    set { view.duration = newValue }
  }

  var borderRadius: Double {
    get { view.cornerRadius }
    set { view.cornerRadius = newValue }
  }

  var shimmerColor: String {
    get { view.shimmerColor }
    set { view.shimmerColor = newValue }
  }

  var highlightOpacity: Double {
    get { view.highlightOpacity }
    set { view.highlightOpacity = newValue }
  }
}

// MARK: - UIColor hex helper

private extension UIColor {
  convenience init?(hex: String) {
    let h = hex.trimmingCharacters(in: .init(charactersIn: "#"))
    guard h.count == 6, let val = UInt64(h, radix: 16) else { return nil }
    self.init(
      red:   CGFloat((val >> 16) & 0xFF) / 255,
      green: CGFloat((val >>  8) & 0xFF) / 255,
      blue:  CGFloat( val        & 0xFF) / 255,
      alpha: 1
    )
  }
}
