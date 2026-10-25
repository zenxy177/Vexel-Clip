# Velex Clip — Yol Haritası

Durumlar **25 Ekim 2026** itibarıyla güncellenmiştir. Planlanan işler tamamlanmış özellik veya ürün taahhüdü değildir.

## Tamamlananlar

- [x] Windows Electron uygulaması, ekran/pencere seçimi, global `Ctrl+Shift+S`, tepsi davranışı ve NSIS kurulum yapılandırması.
- [x] 15/30/60/120 saniyelik geri sarma tamponu; ayarlanabilir FPS, çözünürlük ve bitrate.
- [x] Cihazda klip kitaplığı; önizleme, yeniden adlandırma, arama, filtreleme, sıralama ve WebM indirme.
- [x] Özgün klibi koruyarak yeni kırpılmış klip oluşturma.
- [x] Kullanıcının kendi kimlik bilgileriyle doğrudan S3 uyumlu depolamaya veya Supabase Storage'a isteğe bağlı aktarım.
- [x] Güncelleme denetimi ve GitHub Releases yayın yapılandırması.

## Aktif geliştirme

- Şu anda bu belgede ayrıca tanımlanmış aktif bir geliştirme işi yok.

## Sıradaki doğrulamalar

- [ ] Gerçek kullanıcı hesabıyla her desteklenen bulut bağlantı türünde test ve yükleme denemesi.
- [ ] CORS, bucket izinleri, sağlayıcı dosya sınırı, ağ kesintisi ve yetkisiz erişim senaryolarını doğrulama.
- [ ] Yayımlanmadan önce S3 erişim anahtarlarının kullanıcı tarafından girildiğini; hiçbiri kaynak koda, derlemeye veya Git geçmişine eklenmediğini doğrulama.
- [ ] Farklı Windows ekranları ve kaynaklarında uzun oturum, ses, kare hızı ve çözünürlük davranışını test etme.
- [ ] Temiz Windows ortamında güncel NSIS kurucusunu ve yükseltme akışını doğrulama.

## Daha sonraki olasılıklar

- [ ] Linux/macOS paketleme ve yakalama desteği.
- [ ] Daha kapsamlı düzenleme ve dışa aktarma seçenekleri.
- [ ] İşletim sisteminin güvenli kimlik bilgisi kasasıyla entegrasyon.

## Ürün sınırları

- Klipler önce yerel kitaplığa kaydedilir; buluta aktarımı kullanıcı başlatır ve yerel kopya korunur.
- S3/Supabase erişim bilgileri bu uygulama oturumunda `sessionStorage` içinde tutulur. Bu bir işletim sistemi güvenli kasası değildir; oturumdaki renderer koduna ve uygulama profiline erişebilen kişiler bu bilgileri görebilir.
- Uygulamaya ortak bulut anahtarı, Supabase `service-role` anahtarı veya başka bir sunucu sırrı gömülmez.
- Ücretsiz planlar, fiyatlar, kota ve sağlayıcı özellikleri değişebilir; ücretsiz ya da sınırsız depolama garantisi verilmez.
- Tarayıcı yakalaması açık sekme ve ekran paylaşım izni gerektirir; global kısayol ve tepsi yakalaması Windows masaüstü uygulamasına aittir.
- Linux/macOS yakalama ve paketleme doğrulanmamıştır.
