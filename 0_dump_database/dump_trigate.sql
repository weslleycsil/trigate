-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 27-Set-2021 às 16:24
-- Versão do servidor: 10.4.20-MariaDB
-- versão do PHP: 8.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `trigate`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `login`
--

CREATE TABLE `login` (
  `id` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `nickname` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Extraindo dados da tabela `login`
--

INSERT INTO `login` (`id`, `nickname`, `username`, `password`, `email`, `admin`) VALUES
('2317i313i98930214S231gRe3y0192h762667n4085055f36d', 'Renan', 'Renan', 'Re123123', 'renanpinhoassi@gmail.com', 0),
('2317i313i98930214S231gRe3y0192h762667n4085055f37d', 'Weslley', 'weslley', 'admin1105', 'renanpinhoassi@gmail.com', 0),
('9123e14397355e1130T0te72s5t65657r2T85r6e445s5f8e4', 'Tester', 'Tester', 'Tester123', 'tester@gmail.com', 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `pending_login`
--

CREATE TABLE `pending_login` (
  `id` int(11) NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `nickname` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `secret_code` varchar(10) COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `socket_id` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `description` text COLLATE utf8mb4_bin NOT NULL,
  `cover_image` varchar(50) COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Extraindo dados da tabela `rooms`
--

INSERT INTO `rooms` (`id`, `socket_id`, `name`, `description`, `cover_image`) VALUES
(1, '101', 'V-CTC 101', 'A sala de aula Virtual CTC 101 é uma sala preparada para comportar até 20 alunos.\r\n', 'vctc_101.jpg'),
(2, '102', 'V-CTC 102', 'A sala Virtual CTC 102 é uma sala grande e pode comportar até 100 pessoas.', 'vctc_102.jpg');

-- --------------------------------------------------------

--
-- Estrutura da tabela `rooms_users`
--

CREATE TABLE `rooms_users` (
  `id` int(11) NOT NULL,
  `user` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `room` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nickname` (`nickname`);

--
-- Índices para tabela `pending_login`
--
ALTER TABLE `pending_login`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `rooms_users`
--
ALTER TABLE `rooms_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_user_course_fk` (`room`),
  ADD KEY `course_user_user_fk` (`user`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `pending_login`
--
ALTER TABLE `pending_login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `rooms_users`
--
ALTER TABLE `rooms_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `rooms_users`
--
ALTER TABLE `rooms_users`
  ADD CONSTRAINT `rooms_user_room_fk` FOREIGN KEY (`room`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rooms_user_user_fk` FOREIGN KEY (`user`) REFERENCES `login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/* adicionar novos campos na tabela */

--
-- Adiciona o campo opensim_user a fim de armazenar o nome do usuário no opensim
--
ALTER TABLE  `login `
  ADD COLUMN opensim_user VARCHAR(100);