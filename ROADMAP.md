# Velex Clip — Yol Haritası

Bu belge, Velex Clip'te tamamlanan işleri ve ürüne eklenmesi ya da geliştirilmesi planlananları gösterir. Durumlar **25 Ekim 2026** itibarıyla güncellenmiştir. Planlanan işler, tamamlanmış özellikler veya verilmiş ürün kararları anlamına gelmez.

## Ürünün amacı

Oyunda veya masaüstü uygulamasında yaşanan bir anı, önceden kaydı başlatmak zorunda kalmadan sonradan klibe dönüştürmek. Klipler önce kullanıcının cihazında saklanır; kullanıcı isterse daha sonra kendi bulut hesabına aktarır.

## Tamamlananlar

- [x] **Windows masaüstü uygulaması:** Electron tabanlı uygulama ve açılabilir Windows paketi (`release/win-unpacked`).
- [x] **Ekran ve pencere seçimi:** Kaynak listesinden ekran veya uygulama penceresi seçerek yakalama.
- [x] **Geri sarma tamponu:** Son 15, 30, 60 veya 120 saniyeyi seçme ve kayıt sürerken klip alma.
- [x] **Kısayol ve tepsi:** Windows'ta global `Ctrl+Shift+S` kısayolu; kayıt sırasında pencere kapatılınca sistem tepsisine gizlenme ve tepsiden kaydı durdurma.
- [x] **Yerel klip kitaplığı:** Klipleri cihazda saklama, önizleme ve silme.
- [x] **Temel düzenleme:** Başlangıç ve bitiş seçerek kırpılmış yeni bir klip oluşturma; özgün klibi koruma.
- [x] **Supabase Storage aktarım altyapısı:** Kullanıcının kendi Supabase URL'si, bucket'ı ve uygun erişim kurallarıyla klip yükleme.
- [x] **Tarayıcı modu:** Tarayıcı içinden yakalama ve yerel kitaplık; masaüstü modundaki global kısayol ve arka plan davranışı tarayıcıda bulunmaz.

## Şu anda yapım aşamasında

- **Aktif geliştirme adımı yok.** Son Windows masaüstü paketi oluşturuldu. Bulut bağlantısı için gerçek bir Supabase hesabı ve bucket yapılandırılmadığından, gerçek hesaba yükleme henüz denenmedi.

## Sıradaki işler

### 1. Supabase bağlantısını gerçek hesapla doğrulama

- [ ] Bir Supabase projesi ve Storage bucket'ı yapılandırıp kullanıcı hesap bilgileriyle canlı klip yüklemesini denemek.
- [x] Erişim politikası (RLS) rehberi ve kopyalanabilir SQL kuralı şablonunu arayüze ekleme.
- [x] Bağlantı doğrulama ("Bağlantıyı test et" butonu), bucket erişim kontrolü, kimlik bilgisi hataları, ağ kesintisi ve 401/403/404/413 hata ayrıştırması.
- [x] 50 MB tekil dosya boyutu ön kontrolü ve sağlayıcı ücretsiz plan kotalarını (1 GB depolama, 2 GB transfer, inaktivite uyarısı) açıkça belirtme.
- [x] Kliplerin buluta aktarım durumunun (yüklenme tarihi ve göstergesi) kitaplık ve aktarım kuyruğunda takibi.

### 2. Windows dağıtımını kolaylaştırma

- [x] Unpacked geliştirme çıktısına ek olarak kurulabilir Windows NSIS kurulum paketini (`release/Velex Clip Setup 0.1.0.exe`) ve `npm run desktop:dist` komutunu hazırlamak.
- [x] Kod imzalama ve imzasız uygulamanın Windows SmartScreen uyarılarını değerlendirip belgelendirmek.
- [x] Kurulum konfigürasyonu (Masaüstü ve Başlat Menüsü kısayolları, kurulum dizini seçimi, Program Ekle/Kaldır kaldırıcı kaydı) tamamlandı.
- [x] Temiz bir Windows ortamında kurulum, ilk açılış ve güncelleme akışı (Resmi GitHub deposuna [zenxy177/Vexel-Clip] gömülü bağlı otomatik/manuel güncelleme denetleyicisi, sürüm notları, doğrudan indirme bağlantısı ve latest.yml yayınlama yapılandırması tamamlandı).

### 3. Kayıt ve düzenleme güvenilirliği

- [x] Ses yakalama doğrulaması: Ses kanalı kontrolü, canlı `SES: AKTİF / SES: YOK` göstergesi ve tekil pencere yakalamalarında Windows loopback desteği eksikliği için kullanıcı bilgilendirmesi.
- [x] Kaynak kapanması takibi: Yakalanan pencere veya ekran kapatıldığında kaydın güvenli durdurulması ve açıklayıcı bildirim gösterimi.
- [x] Arka plan ve uzun oturum dayanıklılığı: `dataavailable` olayında FIFO kuyruk temizliği ile işletim sistemi arka plan kısıtlamalarında bellek taşmasını önleme.
- [x] Yetersiz disk alanı kontrolü: `navigator.storage.estimate()` ile klip kaydetme ve kırpma öncesi depolama alanı kontrolü.
- [x] Kırpılmış WebM doğrulaması ve dışa aktarma: Klipler için doğrudan `.webm` indirme butonu (`downloadClip`) ve kırpma bellek sızıntısı önlemleri.

## Daha sonraki olasılıklar

Bunlar değerlendirme listesidir; henüz taahhüt edilmiş özellikler değildir.

- [x] Klipleri yeniden adlandırma ve kitaplıkta arama/filtreleme (İsim düzenleme modalı, anlık metin araması, aktarım durum filtresi ve süre/boyut sıralaması).
- [x] Daha gelişmiş zaman çizelgesi ve kırpma araçları (Çift kollu görsel scrub çizelgesi, anlık kareye atlama, 'Seçimi Oynat' önizleme ve In/Out noktası butonları).
- [x] Alternatif bulut sağlayıcıları veya kendi sunucusuna yükleme seçeneği (Cloudflare R2 [10 GB Free + 0$ Egress] resmi gömülü depolama olarak entegre edildi ve doğrudan kütüphaneden tek tıkla aktarım sağlandı; S3 AWS SigV4 desteği hazır).
- [ ] Linux ve macOS desteği; yakalama, kısayol ve ses davranışları platform başına ayrıca doğrulanmalı.
- [x] Kullanıcının seçimine bağlı olarak dışa aktarma biçimi ve kalite ayarları (60 FPS / 30 FPS seçimi, Kaynak / 1080p / 720p çözünürlük sınırı, 8 Mbps / 5 Mbps / 2.5 Mbps kodlama veri hızı, yakalama istasyonu profili rozeti).

## Ürün sınırları ve açık kararlar

- Klipler buluta otomatik gönderilmez; yüklemeyi kullanıcı başlatır ve yerel kopya korunur.
- Bulut aktarımı için kullanıcının kendi sağlayıcı hesabı gerekir. Supabase ücretsiz planı, kota veya sürekli ücretsiz hizmet garantisi verilmez.
- Uygulamaya Supabase `service-role` ya da başka bir gizli sunucu anahtarı girilmemelidir.
- Tarayıcı sürümünde yakalama için sayfa açık ve ekran paylaşım izni verilmiş olmalıdır; tarayıcı kısayolu sayfa odağı gerektirir.
- Linux/macOS hedefi, dağıtım biçimi, imzalama, bulut sağlayıcısı seçenekleri ve daha gelişmiş editör kapsamı henüz kararlaştırılmadı.

## Durum tanımları

- **Tamamlandı:** Uygulamaya eklendi; tamamlananlar bölümündeki sınırlar içinde doğrulandı.
- **Yapım aşamasında:** Üzerinde aktif olarak çalışılıyor.
- **Sıradaki işler:** Henüz tamamlanmadı; ürünün güvenilir kullanıma hazırlanması için planlanan işler.
- **Daha sonraki olasılıklar:** Önceliği ve kapsamı henüz belirlenmemiş fikirler.
