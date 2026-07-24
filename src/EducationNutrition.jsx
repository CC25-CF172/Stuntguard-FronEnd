import React from "react";
import Navbar from "./pages/components/Navbar";
import Footer from "./pages/components/Footer";
import { useEffect } from "react";
import gambar1 from "./assets/stunting3.jpeg";

const EducationNutrition = () => {
    useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
          <img
            src= {gambar1}
            alt="Ilustrasi Stunting"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <h1 className="text-3xl font-bold text-[#0A192F] mb-4">
            Pencegahan dan Penanganan Stunting pada Anak di Indonesia
          </h1>
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span>Oleh Tim StuntGuard</span>
            <span className="mx-2">•</span>
            <span>Juni 2025</span>
          </div>
          <div className="prose prose-lg prose-slate max-w-none text-justify">
            <p>
              Stunting merupakan permasalahan gizi kronis pada anak di Indonesia,
              yang bisa berdampak buruk pada kesehatan anak dalam jangka waktu lama.
              Faktor penyebabnya adalah kurangnya asupan gizi dalam rentang waktu
              lama, paparan infeksi yang berulang, serta kurangnya stimulasi.
              <br />
              Pemerintah Indonesia menargetkan penurunan angka stunting sebesar 14
              persen pada tahun 2024 dengan melakukan berbagai upaya, termasuk
              mendorong peran ibu dalam mencegah stunting.
            </p>
            <h2>Ciri-ciri Anak Stunting</h2>
            <p>
              Anak dikatakan mengalami stunting, jika pertumbuhan tinggi dan berat
              badan serta lingkar kepalanya tidak sesuai dengan grafik pertumbuhan
              standar, atau dua standar lebih di bawah batas Standar Pertumbuhan
              Anak yang dikeluarkan oleh Badan Kesehatan Dunia (WHO).
            </p>
            <ul>
              <li>
                Secara sekilas proporsi tubuh cenderung tampak normal, tetapi anak
                tampak lebih kecil untuk usianya.
              </li>
              <li>Berbadan lebih pendek dari anak seusianya.</li>
              <li>Memiliki berat badan lebih rendah untuk anak seusianya.</li>
              <li>Pertumbuhan tulang tertunda.</li>
            </ul>
            <h2>10 Langkah Penanganan Stunting</h2>
            <p>
              Saat lahir, bayi normalnya memiliki berat badan di atas 2.5 kg dengan
              panjang badan di atas 47 cm. Waspadai jika bayi baru lahir tidak
              mencapai berat dan tinggi badan normal, karena sangat rawan terkena
              gejala stunting.
              <br />
              Peran ibu dalam mencegah stunting, sebagai Kartini masa depan, bukan
              dimulai ketika anak dilahirkan, melainkan jauh sebelumnya. Lakukan 10
              langkah pencegahan stunting ini untuk menjaga buah hati kita dari
              risiko stunting.
            </p>
            <h3>Perbaiki sebelum Anak Berusia 2 tahun</h3>
            <p>
              Pencegahan stunting dilakukan sejak masa 1000 hari pertama kehidupan,
              yaitu sejak awal pembuahan, kehamilan, sampai anak berusia 2 tahun.
              Selama kehamilan ibu bisa melakukan hal-hal berikut ini untuk
              mengurangi risiko kekurangan gizi bagi ibu hamil dan janin yang
              dikandung.
            </p>
            <h3>Rutin Melakukan Pemeriksaan</h3>
            <p>
              Lakukan pemeriksaan kehamilan di fasilitas kesehatan minimal 6 kali,
              dengan minimal 2 kali pemeriksaan oleh dokter atau bidan pada trimester
              1 dan 3. Tujuannya untuk memastikan kesehatan ibu hamil dan memantau
              pertumbuhan janin dalam kandungan. Jika ditemukan adanya kelainan atau
              gangguan dalam pertumbuhan, ibu hamil bisa segera mendapatkan
              penanganan sedini mungkin yang tepat.
            </p>
            <h3>Minum Tablet Tambah Darah (TTD)</h3>
            <p>
              Ibu harus mengkonsumsi TTD setiap hari selama kehamilan, minimal 90
              tablet. Pastikan kandungan TTD sedikitnya berisi 60 mg zat besi dan 400
              microgram asam folat. Tujuannya untuk mengurangi risiko kekurangan zat
              gizi pada ibu hamil dan janin dalam kandungan.
            </p>
            <h3>Mengikuti Konseling</h3>
            <p>
              Konseling membantu ibu hamil mengatasi gejolak emosi dan psikologis
              yang dirasakan selama kehamilan. Ibu hamil juga perlu mengikuti kelas
              ibu hamil untuk mendapatkan perawatan kehamilan, yang bisa membantu Ibu
              memastikan tumbuh kembang janin yang sehat.
            </p>
            <h3>Berikan Air Susu Ibu (ASI)</h3>
            <p>
              Air susu ibu (ASI) memiliki semua kandungan gizi, makronutrien dan
              mikronutrien, yang dibutuhkan bayi untuk tumbuh kembang secara optimal.
              Ibu harus memberikan Inisiasi Menyusu Dini (IMD) segera setelah
              persalinan dan skin-to-skin contact minimal selama 1 jam.
              <br />
              Kemudian berikan ASI secara eksklusif hingga bayi berusia 6 bulan dan
              meneruskannya hingga usia 2 tahun.
            </p>
            <h3>Posisi Menyusui</h3>
            <p>
              Saat menyusui pastikan posisi ibu tepat, karena bisa mengoptimalkan
              pemberian ASI dan menghindari puting lecet. Perbaiki posisi menyusui
              dengan memastikan kepala dan mulut bayi melekat pas pada payudara.
            </p>
            <h3>Protein Hewani pada MPASI</h3>
            <p>
              Saat bayi berusia 6 bulan, Ibu perlu melengkapi nutrisi dari ASI dengan
              makanan pendamping ASI (MPASI). Makanan yang diberikan harus mengandung
              gizi seimbang dan lengkap, terutama protein hewani. Berikan cukup
              protein hewani sedini mungkin, seperti ikan, telur, susu, daging ayam dan
              daging sapi, untuk mendukung tumbuh kembang optimalnya.
            </p>
            <h3>Rutin Imunisasi</h3>
            <p>
              Tujuan imunisasi adalah melindungi anak dari berbagai penyakit, karena
              kekebalan tubuhnya masih lemah. Pastikan si kecil mendapatkan imunisasi
              lengkap sesuai jadwal. Anak yang sakit-sakitan lebih rentan terkena
              stunting. karena gizi dan energinya lebih banyak digunakan untuk
              pemulihan daripada pertumbuhan.
            </p>
            <h3>Rutin Memantau Tumbuh Kembang Anak</h3>
            <p>
              Bawa anak secara berkala ke posyandu atau fasilitas kesehatan untuk
              memantau status gizinya, sehingga jika mengalami hambatan atau gagal
              pertumbuhan, anak bisa segera mendapatkan penanganan yang tepat.
            </p>
            <h3>Menjaga Perilaku Hidup Bersih dan Sehat</h3>
            <p>
              Peran keluarga juga penting dalam mengurangi risiko stunting dengan
              menjalankan perilaku hidup bersih dan sehat. Jagalah kebersihan rumah
              dan lingkungan, serta biasakan mencuci tangan dengan sabun dan air
              mengalir sebelum dan sesudah makan. Lingkungan yang kotor bisa
              menyebabkan anak mudah terkena penyakit, seperti diare, yang dapat
              menyebabkan anak kekurangan gizi, sehingga rentan terhadap stunting.
            </p>
            <h3>Memakai Jamban Sehat</h3>
            <p>
              Sanitasi yang buruk bisa menimbulkan berbagai gangguan kesehatan dan
              penyakit, seperti cacingan. Anak yang cacingan mudah mengalami
              kekurangan gizi, karena makanan yang masuk akan diserap oleh cacing-cacing
              dalam tubuh, sehingga lama kelamaan rentan terhadap stunting. Oleh
              karenanya, pastikan jamban di rumah memenuhi syarat kesehatan agar tidak
              mencemari lingkungan, termasuk sumber air minum.
            </p>
            <h3>Tangani Gangguan Kesehatan Anak</h3>
            <p>
              Konsultasikan ke dokter dan segera atasi jika anak mengalami gangguan
              kesehatan, seperti gangguan pencernaan. Ketika anak tidak mampu menyerap
              nutrisi dari makanan karena pencernaannya bermasalah, resikonya terkena
              stunting menjadi lebih tinggi.
            </p>
            <h3>Tingkatkan Wawasan Kesehatan</h3>
            <p>
              Orang tua harus banyak belajar dan memperkaya ilmu dan wawasan tentang
              kesehatan dan tumbuh kembang anak, sumber makanan dan minuman bergizi,
              serta cara-cara mencegah stunting.
            </p>
            <h2>Stimulasi Pertumbuhan</h2>
            <p>
              Selain langkah-langkah di atas, anak juga membutuhkan stimulasi atau
              rangsangan, bahkan sejak masih dalam kandungan. Stimulasi harus dilakukan
              setiap hari sejak awal kehamilan untuk merangsang organ-organ tubuh, serta
              kelima inderanya (penglihatan, pendengaran, sentuhan, pembauan dan
              pengecapan).
              <br />
              Setelah lahir, anak harus terus diberikan stimulasi sesuai tahapan usia
              dan tumbuh kembangnya. Apalagi usia 0-3 tahun merupakan masa keemasan
              dalam tahap tumbuh kembang si kecil, sehingga kekurangan stimulasi bisa
              berdampak pada kelainan atau penyimpangan dalam pertumbuhan.
              <br />
              Pada masa ini anak cepat menyerap berbagai informasi dan rangsangan yang
              mereka lihat, dengar, rasakan, cium atau sentuh. Stimulasi yang tepat
              dibutuhkan untuk mengoptimalkan tumbuh kembangnya, termasuk gerak motorik
              kasar dan halus, komunikasi dan emosi.
              <br />
              Mengingat pentingnya masa ini, peran ibu saja dalam mencegah stunting
              tidak cukup. Dibutuhkan dukungan seluruh anggota keluarga hingga
              masyarakat, untuk membantu mengurangi risiko stunting pada anak-anak
              Indonesia demi mewujudkan Generasi Emas 2045.
            </p>
          </div>
        </div>
      </div>
      <Footer />

      <BottomNavbar />
    </div>
  );
};

export default EducationNutrition;