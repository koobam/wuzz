import UIKit

final class NativeProfileView: UIView {

  // MARK: - Views

  private let scrollView = UIScrollView()
  private let contentView = UIView()

  private let headerView = UIView()
  private let nameLabel = UILabel()

  private let tabBar = UISegmentedControl(items: ["Clip", "Daily", "Journal"])

  private let pager: UICollectionView

  // MARK: - Constants

  private let headerHeight: CGFloat = 220
  private let tabHeight: CGFloat = 44

  // MARK: - Init

  override init(frame: CGRect) {

    let layout = UICollectionViewFlowLayout()
    layout.scrollDirection = .horizontal
    layout.minimumLineSpacing = 0
    layout.minimumInteritemSpacing = 0

    pager = UICollectionView(frame: .zero, collectionViewLayout: layout)

    super.init(frame: frame)

    setup()
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  // MARK: - Setup

  private func setup() {
    backgroundColor = .systemBackground

    // ScrollView
    scrollView.alwaysBounceVertical = true
    scrollView.showsVerticalScrollIndicator = true
    addSubview(scrollView)

    scrollView.addSubview(contentView)

    // ContentView (debug color)
    contentView.backgroundColor = UIColor.systemBlue.withAlphaComponent(0.1)

    // Header
    headerView.backgroundColor = .systemGray5
    contentView.addSubview(headerView)

    nameLabel.text = "Native Profile"
    nameLabel.font = .boldSystemFont(ofSize: 24)
    nameLabel.textAlignment = .center
    headerView.addSubview(nameLabel)

    // Tab Bar
    tabBar.selectedSegmentIndex = 0
    tabBar.addTarget(self, action: #selector(tabChanged), for: .valueChanged)
    contentView.addSubview(tabBar)

    // Pager
    pager.backgroundColor = UIColor.systemPurple.withAlphaComponent(0.1)
    pager.isPagingEnabled = true
    pager.showsHorizontalScrollIndicator = false
    pager.dataSource = self
    pager.delegate = self
    pager.register(PageCell.self, forCellWithReuseIdentifier: "PageCell")
    contentView.addSubview(pager)
  }

  // MARK: - Layout

  override func layoutSubviews() {
    super.layoutSubviews()

    let width = bounds.width
    let height = bounds.height

    // Root scroll
    scrollView.frame = bounds

    // Content size (IMPORTANT)
    let contentHeight = headerHeight + tabHeight + height
    contentView.frame = CGRect(
      x: 0,
      y: 0,
      width: width,
      height: contentHeight
    )

    scrollView.contentSize = contentView.frame.size

    // Header
    headerView.frame = CGRect(
      x: 0,
      y: 0,
      width: width,
      height: headerHeight
    )

    nameLabel.frame = CGRect(
      x: 16,
      y: headerHeight / 2 - 20,
      width: width - 32,
      height: 40
    )

    // Tab
    tabBar.frame = CGRect(
      x: 16,
      y: headerView.frame.maxY,
      width: width - 32,
      height: tabHeight
    )

    // Pager
    pager.frame = CGRect(
      x: 0,
      y: tabBar.frame.maxY,
      width: width,
      height: height
    )

    // Pager item size
    if let layout = pager.collectionViewLayout as? UICollectionViewFlowLayout {
      layout.itemSize = pager.bounds.size
    }
  }

  // MARK: - Actions

  @objc private func tabChanged() {
    let index = tabBar.selectedSegmentIndex
    pager.scrollToItem(
      at: IndexPath(item: index, section: 0),
      at: .centeredHorizontally,
      animated: true
    )
  }
}

// MARK: - Pager DataSource & Delegate

extension NativeProfileView: UICollectionViewDataSource, UICollectionViewDelegate {

  func collectionView(_ collectionView: UICollectionView,
                      numberOfItemsInSection section: Int) -> Int {
    return 3
  }

  func collectionView(_ collectionView: UICollectionView,
                      cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
    let cell = collectionView.dequeueReusableCell(
      withReuseIdentifier: "PageCell",
      for: indexPath
    )
    cell.configure(index: indexPath.item)
    return cell
  }

  func scrollViewDidEndDecelerating(_ scrollView: UIScrollView) {
    let index = Int(scrollView.contentOffset.x / scrollView.bounds.width)
    tabBar.selectedSegmentIndex = index
  }
}
